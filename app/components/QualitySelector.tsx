"use client";

import { memo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import type { QualityOption } from "@/app/types/video";
import { formatFileSize } from "@/app/lib/utils";

interface QualitySelectorProps {
  options: QualityOption[];
  selected: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  formatType: "video" | "audio";
}

/**
 * Quality selector component with memoization for better performance
 */
const QualitySelector = memo(function QualitySelector({
  options,
  selected,
  onChange,
  disabled,
  formatType,
}: QualitySelectorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Quality
      </label>
      <div className="relative">
        <select
          value={selected}
          onChange={handleChange}
          disabled={disabled || options.length === 0}
          className={`
            w-full appearance-none
            glass rounded-xl py-3 px-4 pr-12
            text-white
            focus:outline-none input-glow
            transition-all duration-300
            cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {options.length === 0 ? (
            <option value="">No options available</option>
          ) : (
            options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-gray-800 text-white"
              >
                {option.label}
                {option.filesize ? ` (${formatFileSize(option.filesize)})` : ""}
              </option>
            ))
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {formatType === "video"
          ? "Higher resolution = larger file size"
          : "Higher bitrate = better audio quality"}
      </p>
    </div>
  );
});

export default QualitySelector;
