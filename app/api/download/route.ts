import { NextRequest, NextResponse } from "next/server";
import { sanitizeFilename } from "@/app/lib/utils";
import { rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { createReadStream, existsSync } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const format = searchParams.get("format") as "video" | "audio";
  const title = searchParams.get("title") || "download";

  if (!id || !format) {
    return NextResponse.json({ error: "Missing id or format" }, { status: 400 });
  }

  // Validate ID to prevent directory traversal
  if (!id.startsWith("ytdlp-") || id.includes("/") || id.includes("\\")) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const tempDir = join(tmpdir(), id);
  const extension = format === "audio" ? "mp3" : "mp4";
  const tempFile = join(tempDir, `output.${extension}`);

  if (!existsSync(tempFile)) {
    return NextResponse.json({ error: "File not found or expired. Please download again." }, { status: 404 });
  }

  try {
    let isCancelled = false;
    const nodeStream = createReadStream(tempFile);

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => {
          if (isCancelled) {
            nodeStream.destroy();
            return;
          }
          try {
            controller.enqueue(chunk);
          } catch (e) {
            isCancelled = true;
            nodeStream.destroy();
          }
        });

        nodeStream.on("end", () => {
          if (!isCancelled) {
            try { controller.close(); } catch (e) {}
          }
          // Cleanup the file once streamed successfully
          rm(tempDir, { recursive: true, force: true }).catch(() => {});
        });

        nodeStream.on("error", (err) => {
          if (!isCancelled) {
            try { controller.error(err); } catch (e) {}
          }
          rm(tempDir, { recursive: true, force: true }).catch(() => {});
        });
      },
      cancel() {
        isCancelled = true;
        nodeStream.destroy();
        rm(tempDir, { recursive: true, force: true }).catch(() => {});
      },
    });

    request.signal.addEventListener("abort", () => {
      isCancelled = true;
      nodeStream.destroy();
      rm(tempDir, { recursive: true, force: true }).catch(() => {});
    });

    const filename = sanitizeFilename(title);
    const contentType = format === "audio" ? "audio/mpeg" : "video/mp4";

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}.${extension}"`,
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    });

    return new NextResponse(webStream, { headers });
  } catch (error: any) {
    rm(tempDir, { recursive: true, force: true }).catch(() => {});
    return NextResponse.json({ error: error.message || "Download failed" }, { status: 500 });
  }
}
