import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { sanitizeFilename } from "@/app/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const format = searchParams.get("format") as "video" | "audio";
  const quality = searchParams.get("quality");
  const title = searchParams.get("title") || "download";

  // Validate parameters
  if (!url || !format || !quality) {
    return NextResponse.json(
      { error: "Missing required parameters: url, format, quality" },
      { status: 400 }
    );
  }

  try {
    // Build yt-dlp arguments
    const args: string[] = [url, "-o", "-"]; // Output to stdout

    if (format === "audio") {
      args.push(
        "-x", // Extract audio
        "--audio-format", "mp3",
        "--audio-quality", quality === "320" ? "0" : quality === "256" ? "1" : quality === "192" ? "2" : "5"
      );
    } else {
      // Video format
      const height = quality.replace("p", "");
      args.push(
        "-f", `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`,
        "--merge-output-format", "mp4"
      );
    }

    // Spawn yt-dlp process
    const ytdlp = spawn("yt-dlp", args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    // Collect stderr for error handling
    let stderrData = "";
    ytdlp.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    // Convert Node.js stream to Web ReadableStream
    const nodeStream = ytdlp.stdout;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        nodeStream.on("end", () => {
          controller.close();
        });
        nodeStream.on("error", (err) => {
          controller.error(err);
        });
      },
      cancel() {
        ytdlp.kill();
      },
    });

    // Set appropriate headers for download
    const filename = sanitizeFilename(title);
    const contentType = format === "audio" ? "audio/mpeg" : "video/mp4";
    const extension = format === "audio" ? "mp3" : "mp4";

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}.${extension}"`,
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    });

    // Handle process errors
    ytdlp.on("error", (error) => {
      console.error("yt-dlp process error:", error);
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        console.error("yt-dlp exited with code:", code, "stderr:", stderrData);
      }
    });

    return new NextResponse(webStream, { headers });
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: error.message || "Download failed" },
      { status: 500 }
    );
  }
}
