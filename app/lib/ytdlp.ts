import { create } from "youtube-dl-exec";
import type { VideoInfo, VideoFormat, QualityOption } from "@/app/types/video";

// Create yt-dlp instance - try common paths
const ytdlp = create("yt-dlp");

// Helper to format duration from seconds
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Helper to format file size
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown size";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Parse video quality options from formats
function parseVideoQualities(formats: VideoFormat[]): QualityOption[] {
  // Include formats with video codec (with or without audio - we'll merge later)
  const videoFormats = formats.filter(
    (f) => f.vcodec !== "none" && f.height
  );

  // Group by resolution and pick best quality for each
  const qualityMap = new Map<number, VideoFormat>();
  
  for (const format of videoFormats) {
    if (format.height) {
      const existing = qualityMap.get(format.height);
      if (!existing || (format.filesize || 0) > (existing.filesize || 0)) {
        qualityMap.set(format.height, format);
      }
    }
  }

  // Define all standard resolutions with labels
  const standardResolutions: { height: number; label: string }[] = [
    { height: 4320, label: "8K (4320p)" },
    { height: 2160, label: "4K (2160p)" },
    { height: 1440, label: "2K (1440p)" },
    { height: 1080, label: "Full HD (1080p)" },
    { height: 720, label: "HD (720p)" },
    { height: 480, label: "SD (480p)" },
    { height: 360, label: "360p" },
    { height: 240, label: "240p" },
    { height: 144, label: "144p" },
  ];

  // Get available heights sorted by resolution descending
  const availableHeights = Array.from(qualityMap.keys()).sort((a, b) => b - a);

  // Map to quality options with proper labels
  const options: QualityOption[] = availableHeights.map((height) => {
    const format = qualityMap.get(height)!;
    const standardRes = standardResolutions.find(r => r.height === height);
    
    return {
      label: standardRes?.label || `${height}p`,
      value: `${height}p`,
      formatId: format.format_id,
      filesize: format.filesize || format.filesize_approx,
    };
  });

  // If no formats found, provide default options for yt-dlp to handle
  if (options.length === 0) {
    return [
      { label: "Best Quality", value: "best", formatId: "bestvideo+bestaudio/best" },
      { label: "4K (2160p)", value: "2160p", formatId: "bestvideo[height<=2160]+bestaudio/best" },
      { label: "Full HD (1080p)", value: "1080p", formatId: "bestvideo[height<=1080]+bestaudio/best" },
      { label: "HD (720p)", value: "720p", formatId: "bestvideo[height<=720]+bestaudio/best" },
      { label: "SD (480p)", value: "480p", formatId: "bestvideo[height<=480]+bestaudio/best" },
      { label: "360p", value: "360p", formatId: "bestvideo[height<=360]+bestaudio/best" },
    ];
  }

  return options;
}

// Parse audio quality options from formats
function parseAudioQualities(formats: VideoFormat[]): QualityOption[] {
  const audioFormats = formats.filter(
    (f) => f.vcodec === "none" && f.acodec !== "none" && f.abr
  );

  // Group by bitrate and pick best for each
  const bitrateMap = new Map<number, VideoFormat>();
  
  for (const format of audioFormats) {
    if (format.abr) {
      const roundedBitrate = Math.round(format.abr / 32) * 32; // Round to nearest 32kbps
      const existing = bitrateMap.get(roundedBitrate);
      if (!existing || (format.filesize || 0) > (existing.filesize || 0)) {
        bitrateMap.set(roundedBitrate, format);
      }
    }
  }

  // Sort by bitrate descending
  const sortedBitrates = Array.from(bitrateMap.keys()).sort((a, b) => b - a);

  // If no audio-only formats found, provide default options
  if (sortedBitrates.length === 0) {
    return [
      { label: "320 kbps (Best)", value: "320", formatId: "bestaudio" },
      { label: "256 kbps", value: "256", formatId: "bestaudio" },
      { label: "192 kbps", value: "192", formatId: "bestaudio" },
      { label: "128 kbps", value: "128", formatId: "bestaudio" },
    ];
  }

  return sortedBitrates.map((bitrate) => {
    const format = bitrateMap.get(bitrate)!;
    return {
      label: `${bitrate} kbps`,
      value: `${bitrate}`,
      formatId: format.format_id,
      filesize: format.filesize || format.filesize_approx,
    };
  });
}

// Fetch video information
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      callHome: false,
      preferFreeFormats: true,
      // Skip download, just get info
      skipDownload: true,
    }) as any;

    // Handle both single video and playlist
    const videoData = info.entries ? info.entries[0] : info;

    const formats: VideoFormat[] = (videoData.formats || []).map((f: any) => ({
      format_id: f.format_id,
      format_note: f.format_note || "",
      ext: f.ext,
      resolution: f.resolution || `${f.width}x${f.height}`,
      filesize: f.filesize,
      filesize_approx: f.filesize_approx,
      acodec: f.acodec || "none",
      vcodec: f.vcodec || "none",
      abr: f.abr,
      vbr: f.vbr,
      fps: f.fps,
      height: f.height,
      width: f.width,
    }));

    const videoQualities = parseVideoQualities(formats);
    const audioQualities = parseAudioQualities(formats);

    // Add default best quality options if needed
    if (videoQualities.length === 0) {
      videoQualities.push(
        { label: "Best Quality", value: "best", formatId: "bestvideo+bestaudio/best" }
      );
    }

    return {
      id: videoData.id,
      title: videoData.title,
      thumbnail: videoData.thumbnail || videoData.thumbnails?.[0]?.url || "",
      duration: videoData.duration || 0,
      duration_string: formatDuration(videoData.duration || 0),
      uploader: videoData.uploader || videoData.channel || "Unknown",
      view_count: videoData.view_count,
      upload_date: videoData.upload_date,
      description: videoData.description,
      formats,
      videoQualities,
      audioQualities,
    };
  } catch (error: any) {
    // Parse yt-dlp error messages for better user feedback
    const errorMessage = error.stderr || error.message || "";
    const errorCode = error.code || "";

    // Check if yt-dlp is not installed
    if (
      errorCode === "ENOENT" ||
      errorMessage.includes("ENOENT") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("not recognized") ||
      errorMessage.includes("is not recognized as an internal or external command")
    ) {
      throw new Error(
        "yt-dlp is not installed. Please install it: pip install yt-dlp (and ensure Python and FFmpeg are installed)"
      );
    }

    if (errorMessage.includes("Private video")) {
      throw new Error("This video is private and cannot be accessed.");
    }
    if (errorMessage.includes("Video unavailable")) {
      throw new Error("This video is unavailable or has been removed.");
    }
    if (errorMessage.includes("Sign in to confirm your age")) {
      throw new Error("This video is age-restricted and cannot be downloaded.");
    }
    if (errorMessage.includes("Unsupported URL")) {
      throw new Error("This URL is not supported. Please try a different video link.");
    }
    if (errorMessage.includes("Unable to extract")) {
      throw new Error("Could not extract video information. The URL may be invalid.");
    }
    if (errorMessage.includes("HTTP Error 403")) {
      throw new Error("Access forbidden. The video may be geo-restricted or require authentication.");
    }
    if (errorMessage.includes("HTTP Error 404")) {
      throw new Error("Video not found. Please check the URL and try again.");
    }

    // If we have some error message, use it; otherwise provide a generic message
    if (errorMessage && errorMessage !== "Unknown error") {
      throw new Error(`Failed to fetch video info: ${errorMessage}`);
    }
    
    throw new Error("Failed to fetch video info. Ensure yt-dlp is installed and the URL is valid.");
  }
}

// Get the download options for yt-dlp
export function getDownloadOptions(format: "video" | "audio", quality: string, formatId?: string) {
  if (format === "audio") {
    return {
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: quality === "320" ? "0" : quality === "256" ? "1" : quality === "192" ? "2" : "5",
      output: "-", // Output to stdout
    };
  }

  // Video format
  return {
    format: formatId || `bestvideo[height<=${quality.replace("p", "")}]+bestaudio/best[height<=${quality.replace("p", "")}]/best`,
    mergeOutputFormat: "mp4",
    output: "-", // Output to stdout
  };
}
