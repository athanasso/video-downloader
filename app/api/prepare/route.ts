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

  if (!url || !format || !quality) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  // Generate a temporary directory and file path
  const tempDir = await mkdtemp(join(tmpdir(), "ytdlp-"));
  const extension = format === "audio" ? "mp3" : "mp4";
  const tempFile = join(tempDir, `output.${extension}`);

  const args: string[] = [url, "-o", tempFile, "--no-update", "-N", "8", "--remote-components", "ejs:github"];

  // Use cookies.txt if available (needed for YouTube bot detection)
  const cookiesPath = getCookiesPath();
  if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  if (format === "audio") {
    args.push("-x", "--audio-format", "mp3", "--audio-quality", quality === "320" ? "0" : quality === "256" ? "1" : quality === "192" ? "2" : "5");
  } else {
    const height = quality.replace("p", "");
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

      ytdlp.on("close", (code) => {
        if (isCancelled) return;
        if (code === 0) {
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
