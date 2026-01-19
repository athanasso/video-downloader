"use client";

import { Download, Loader2, Check } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isComplete?: boolean;
  disabled?: boolean;
  format: "video" | "audio";
}

export default function DownloadButton({
  onClick,
  isLoading,
  isComplete,
  disabled,
  format,
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-4 px-6 rounded-xl
        font-semibold text-base
        flex items-center justify-center gap-3
        transition-all duration-300
        ${
          isComplete
            ? "bg-green-500 text-white"
            : isLoading
            ? "bg-gray-600 text-gray-300 cursor-wait"
            : "btn-gradient text-white"
        }
        ${disabled && !isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {isComplete ? (
        <>
          <Check className="w-5 h-5" />
          <span>Download Complete!</span>
        </>
      ) : isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Preparing Download...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download {format === "video" ? "Video" : "Audio"}</span>
        </>
      )}
    </button>
  );
}
