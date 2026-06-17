import React, { useState } from "react";
import type { PlaylistInfo, PlaylistEntry, FormatType } from "../types/video";
import { Download, CheckCircle2, Film, Music, Loader2 } from "lucide-react";

interface PlaylistViewProps {
  playlist: PlaylistInfo;
  onDownload: (url: string, format: FormatType, quality: string, title: string) => void;
  disabled?: boolean;
}

const DEFAULT_QUALITIES = [
  { label: "Best Quality", value: "best" },
  { label: "1080p", value: "1080p" },
  { label: "720p", value: "720p" },
  { label: "480p", value: "480p" },
];

const AUDIO_QUALITIES = [
  { label: "320 kbps", value: "320" },
  { label: "192 kbps", value: "192" },
  { label: "128 kbps", value: "128" },
];

export default function PlaylistView({ playlist, onDownload, disabled }: PlaylistViewProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("video");
  const [selectedQuality, setSelectedQuality] = useState("best");
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const qualities = selectedFormat === "video" ? DEFAULT_QUALITIES : AUDIO_QUALITIES;

  // Handle format change to update quality accordingly
  const handleFormatChange = (format: FormatType) => {
    setSelectedFormat(format);
    setSelectedQuality(format === "video" ? "best" : "320");
  };

  const handleEntryDownload = (entry: PlaylistEntry) => {
    setDownloadingIds((prev) => new Set(prev).add(entry.id));
    onDownload(entry.url, selectedFormat, selectedQuality, entry.title);
    
    // Reset the downloading state after a bit since we don't have per-item progress here easily
    setTimeout(() => {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(entry.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {playlist.thumbnail && (
            <img
              src={playlist.thumbnail}
              alt={playlist.title}
              className="w-full md:w-48 h-auto rounded-lg object-cover shadow-lg"
            />
          )}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{playlist.title}</h2>
              <p className="text-gray-400">
                {playlist.channel} • {playlist.itemCount} videos
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-medium text-gray-300">Global Download Settings</h3>
              <div className="flex gap-4 flex-wrap">
                <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
                  <button
                    onClick={() => handleFormatChange("video")}
                    disabled={disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      selectedFormat === "video"
                        ? "bg-primary-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Film className="w-4 h-4" />
                    <span className="font-medium">Video</span>
                  </button>
                  <button
                    onClick={() => handleFormatChange("audio")}
                    disabled={disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      selectedFormat === "audio"
                        ? "bg-primary-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Music className="w-4 h-4" />
                    <span className="font-medium">Audio</span>
                  </button>
                </div>
                
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  disabled={disabled}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                >
                  {qualities.map((q) => (
                    <option key={q.value} value={q.value} className="bg-gray-900">
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white px-2">Playlist Videos</h3>
        {playlist.entries.map((entry, idx) => (
          <div key={entry.id + idx} className="glass rounded-xl p-4 flex gap-4 items-center transition-all hover:bg-white/[0.04]">
            <span className="text-gray-500 font-medium w-6 text-center">{idx + 1}</span>
            {entry.thumbnail && (
              <img
                src={entry.thumbnail}
                alt={entry.title}
                className="w-24 h-16 rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{entry.title}</h4>
              <p className="text-sm text-gray-400">
                {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <button
              onClick={() => handleEntryDownload(entry)}
              disabled={disabled || downloadingIds.has(entry.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-primary-500 text-white rounded-lg transition-all disabled:opacity-50 group"
            >
              {downloadingIds.has(entry.id) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
