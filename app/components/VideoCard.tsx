"use client";

import { memo } from "react";
import Image from "next/image";
import { User, Eye, Calendar } from "lucide-react";
import type { VideoInfo } from "@/app/types/video";
import { formatViewCount, formatDate } from "@/app/lib/utils";

interface VideoCardProps {
  video: VideoInfo;
}

/**
 * Video card component displaying video thumbnail and metadata
 * Memoized to prevent unnecessary re-renders when parent updates
 */
const VideoCard = memo(function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden card-hover animate-slide-up">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-800">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={false}
            loading="lazy"
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
});

export default VideoCard;
