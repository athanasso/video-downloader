"use client";

import { memo } from "react";
import { Download, Loader2, Check } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isComplete?: boolean;
  disabled?: boolean;
  format: "video" | "audio";
  progress?: number;
}

/**
 * Download button component with loading and completion states
 * Memoized to prevent unnecessary re-renders
 */
const DownloadButton = memo(function DownloadButton({
  onClick,
  isLoading,
  isComplete,
  disabled,
  format,
  progress,
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative w-full py-4 px-6 rounded-xl overflow-hidden
        font-semibold text-base
        transition-all duration-300
        ${
          isComplete
            ? "bg-green-500 text-white"
            : isLoading
            ? "bg-gray-800 text-gray-300 cursor-wait border border-gray-700"
            : "btn-gradient text-white"
        }
        ${disabled && !isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {isLoading && progress !== undefined && (
        <div 
          className="absolute left-0 top-0 bottom-0 bg-primary-500/30 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      
      <div className="relative z-10 flex items-center justify-center gap-3">
        {isComplete ? (
          <>
            <Check className="w-5 h-5" />
            <span>Download Complete!</span>
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{progress !== undefined ? `Downloading... ${progress.toFixed(1)}%` : "Preparing..."}</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download {format === "video" ? "Video" : "Audio"}</span>
          </>
        )}
      </div>
    </button>
  );
});

export default DownloadButton;

