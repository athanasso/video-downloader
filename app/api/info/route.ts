import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/app/lib/ytdlp";
import type { ApiResponse, VideoInfo } from "@/app/types/video";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || typeof url !== "string") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch video information
    const videoInfo = await getVideoInfo(url);

    return NextResponse.json<ApiResponse<VideoInfo>>({
      success: true,
      data: videoInfo,
    });
  } catch (error: any) {
    console.error("Error fetching video info:", error);

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error.message || "Failed to fetch video information",
      },
      { status: 500 }
    );
  }
}
