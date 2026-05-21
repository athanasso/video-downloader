import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { getCookiesPath } from "@/app/lib/ytdlp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const format = searchParams.get("format") as "video" | "audio";
  const quality = searchParams.get("quality");
  const force1080p = searchParams.get("force1080p") === "true";
  const enhance = searchParams.get("enhance") === "true";

  if (!url || !format || !quality) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  // Generate a temporary directory and file path
  const tempDir = await mkdtemp(join(tmpdir(), "ytdlp-"));
  const extension = format === "audio" ? "mp3" : "mp4";
  const tempFile = join(tempDir, `output.${extension}`);

  const args: string[] = [
    url, 
    "-o", tempFile, 
    "--no-update", 
    "-N", "8", 
    "--remote-components", "ejs:github",
    "--extractor-args", "youtube:player_client=default,ios,android,web_safari"
  ];

  // Use cookies.txt if available (needed for YouTube bot detection)
  const cookiesPath = getCookiesPath();
  if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  if (format === "audio") {
    args.push("-x", "--audio-format", "mp3", "--audio-quality", quality === "320" ? "0" : quality === "256" ? "1" : quality === "192" ? "2" : "5");
  } else {
    const height = force1080p ? "1080" : quality.replace("p", "");
    args.push("-f", `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`, "--merge-output-format", "mp4");
  }

  const ytdlp = spawn("yt-dlp", args, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stream = new ReadableStream({
    start(controller) {
      let isCancelled = false;

      request.signal.addEventListener("abort", () => {
        isCancelled = true;
        ytdlp.kill();
        rm(tempDir, { recursive: true, force: true }).catch(() => {});
      });

      const sendEvent = (event: string, data: any) => {
        if (!isCancelled) {
          try {
            controller.enqueue(new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
          } catch (e) {
            isCancelled = true;
            ytdlp.kill();
          }
        }
      };

      ytdlp.stdout.on("data", (chunk) => {
        const output = chunk.toString();
        // Parse progress from yt-dlp output
        // Example: [download]  15.2% of  1.23GiB at  6.49MiB/s ETA 02:14
        const progressMatch = output.match(/\[download\]\s+([\d\.]+)%/);
        if (progressMatch && progressMatch[1]) {
          sendEvent("progress", { percent: parseFloat(progressMatch[1]) });
        }
      });

      let stderrData = "";
      ytdlp.stderr.on("data", (chunk) => {
        stderrData += chunk.toString();
      });

      ytdlp.on("close", async (code) => {
        if (isCancelled) return;
        if (code === 0) {
          
          if (force1080p && format === "video") {
            try {
              sendEvent("progress", { percent: 100, message: "Upscaling to 1080p (this may take a while)..." });
              
              const tempOutFile = join(tempDir, `upscale.mp4`);
              const vfScale = enhance
                ? "scale=-2:1080:flags=lanczos,hqdn3d=1.5:1.5:6:6,unsharp=3:3:0.5:3:3:0.0"
                : "scale=-2:1080:flags=lanczos";

              const ffmpegArgs = [
                "-y", 
                "-i", tempFile, 
                "-map", "0:v:0", 
                "-map", "0:a?", 
                "-c:v", "libx264", 
                "-preset", "faster", 
                "-crf", "28", 
                "-threads", "0",
                "-vf", vfScale, 
                "-c:a", "copy", 
                tempOutFile
              ];
              
              const ffmpeg = spawn("ffmpeg", ffmpegArgs);
              
              let duration = 0;
              ffmpeg.stderr.on("data", (chunk) => {
                const str = chunk.toString();
                const durMatch = str.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
                if (durMatch) {
                  duration = parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60 + parseFloat(durMatch[3]);
                }
                
                const timeMatch = str.match(/time=(\d+):(\d+):(\d+\.\d+)/);
                if (timeMatch && duration > 0) {
                  const time = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseFloat(timeMatch[3]);
                  const percent = Math.min(99, Math.round((time / duration) * 100));
                  sendEvent("progress", { percent, message: `Upscaling... ${percent}%` });
                }
              });

              await new Promise((resolve, reject) => {
                let errLog = "";
                ffmpeg.stderr.on("data", (chunk) => { errLog += chunk.toString(); });
                ffmpeg.on("close", (ffmpegCode) => {
                  if (ffmpegCode === 0) resolve(true);
                  else reject(new Error("FFmpeg failed with code " + ffmpegCode + "\n" + errLog));
                });
                ffmpeg.on("error", reject);
              });

              await rm(tempFile, { force: true });
              const { rename } = await import("fs/promises");
              await rename(tempOutFile, tempFile);
              
            } catch (err: any) {
              console.error("Upscale failed:", err);
              sendEvent("error", { message: `Upscaling failed: ${err.message || "Unknown error"}` });
              try { controller.close(); } catch (e) {}
              return; // Stop here so we don't send 'complete'
            }
          }

          // Extract just the folder name for the ID
          const folderName = tempDir.split(/[\/\\]/).pop();
          sendEvent("complete", { id: folderName });
        } else {
          sendEvent("error", { message: `Download failed: ${stderrData}` });
          rm(tempDir, { recursive: true, force: true }).catch(() => {});
        }
        try { controller.close(); } catch (e) {}
      });
    },
    cancel() {
      ytdlp.kill();
      rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
