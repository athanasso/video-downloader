"use client";

import Image from "next/image";
import { Clock, User, Eye, Calendar } from "lucide-react";
import type { VideoInfo } from "@/app/types/video";

interface VideoCardProps {
  video: VideoInfo;
}

function formatViewCount(count?: number): string {
  if (!count) return "";
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr || dateStr.length !== 8) return "";
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden card-hover animate-slide-up">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-800">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs font-medium text-white">
          {video.duration_string}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
          {video.uploader && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{video.uploader}</span>
            </div>
          )}
          {video.view_count && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{formatViewCount(video.view_count)}</span>
            </div>
          )}
          {video.upload_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(video.upload_date)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
