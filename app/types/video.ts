// Video information returned from the /api/info endpoint
export interface VideoFormat {
  format_id: string;
  format_note: string;
  ext: string;
  resolution: string;
  filesize?: number;
  filesize_approx?: number;
  acodec: string;
  vcodec: string;
  abr?: number; // Audio bitrate
  vbr?: number; // Video bitrate
  fps?: number;
  height?: number;
  width?: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  duration_string: string;
  uploader: string;
  view_count?: number;
  upload_date?: string;
  description?: string;
  formats: VideoFormat[];
  videoQualities: QualityOption[];
  audioQualities: QualityOption[];
}

export interface QualityOption {
  label: string;
  value: string;
  formatId: string;
  filesize?: number;
}

export type FormatType = "video" | "audio";

export interface DownloadRequest {
  url: string;
  format: FormatType;
  quality: string;
  formatId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}
