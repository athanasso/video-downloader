"use client";

import { Video, Music } from "lucide-react";
import type { FormatType } from "@/app/types/video";

interface FormatSelectorProps {
  selected: FormatType;
  onChange: (format: FormatType) => void;
  disabled?: boolean;
}

export default function FormatSelector({ selected, onChange, disabled }: FormatSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Format
      </label>
      <div className="glass rounded-xl p-1 flex">
        <button
          type="button"
          onClick={() => onChange("video")}
          disabled={disabled}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
            font-medium text-sm transition-all duration-300
            ${
              selected === "video"
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <Video className="w-5 h-5" />
          <span>Video (MP4)</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("audio")}
          disabled={disabled}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
            font-medium text-sm transition-all duration-300
            ${
              selected === "audio"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <Music className="w-5 h-5" />
          <span>Audio (MP3)</span>
        </button>
      </div>
    </div>
  );
}
