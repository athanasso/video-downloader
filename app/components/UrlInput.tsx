"use client";

import { useState, useCallback, memo } from "react";
import { Search, Loader2, Link as LinkIcon } from "lucide-react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

/**
 * URL input component with validation and paste functionality
 * Memoized for better performance
 */
const UrlInput = memo(function UrlInput({ onSubmit, isLoading, disabled }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = useCallback((input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    onSubmit(trimmedUrl);
  }, [url, validateUrl, onSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError("");
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && validateUrl(text)) {
        setUrl(text);
        setError("");
      }
    } catch {
      // Clipboard access denied - silently fail
    }
  }, [validateUrl]);

  const isDisabled = disabled || isLoading;
  const canSubmit = !isDisabled && url.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <LinkIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="Paste video URL here (YouTube, Vimeo, etc.)"
          className={`
            w-full pl-12 pr-36 py-4 
            glass rounded-xl
            text-white placeholder-gray-400
            focus:outline-none input-glow
            transition-all duration-300
            ${error ? "border-red-500/50" : "border-white/10"}
          `}
          disabled={isDisabled}
          aria-label="Video URL input"
          aria-invalid={!!error}
          aria-describedby={error ? "url-error" : undefined}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            disabled={isDisabled}
            aria-label="Paste from clipboard"
          >
            Paste
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="
              btn-gradient px-6 py-2 rounded-lg
              text-white font-medium text-sm
              flex items-center gap-2
              disabled:opacity-50
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Fetch Info</span>
              </>
            )}
          </button>
        </div>
      </div>
      {error && (
        <p id="url-error" className="mt-2 text-sm text-red-400 animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </form>
  );
});

export default UrlInput;

