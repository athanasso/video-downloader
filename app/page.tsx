"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import UrlInput from "./components/UrlInput";
import VideoCard from "./components/VideoCard";
import FormatSelector from "./components/FormatSelector";
import QualitySelector from "./components/QualitySelector";
import DownloadButton from "./components/DownloadButton";
import ToastContainer from "./components/Toast";
import AdBanner from "./components/AdBanner";
import FeatureCard from "./components/FeatureCard";
import { useToast } from "./hooks/useToast";
import type { VideoInfo, FormatType, ApiResponse } from "./types/video";
import { Sparkles, Shield, Zap, Globe } from "lucide-react";

// Constants
const AD_SLOT_1 = process.env.NEXT_PUBLIC_AD_SLOT_1 || "";
const AD_SLOT_2 = process.env.NEXT_PUBLIC_AD_SLOT_2 || "";

export default function Home() {
  // State management
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("video");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  const { toasts, removeToast, success, error, info } = useToast();

  // Memoized quality options
  const qualityOptions = useMemo(() => {
    if (!videoInfo) return [];
    return selectedFormat === "video"
      ? videoInfo.videoQualities
      : videoInfo.audioQualities;
  }, [videoInfo, selectedFormat]);

  // Update quality when format or video info changes
  useEffect(() => {
    if (qualityOptions.length > 0) {
      setSelectedQuality(qualityOptions[0].value);
    }
  }, [qualityOptions]);

  // Reset download complete state when changing selections
  useEffect(() => {
    setDownloadComplete(false);
  }, [selectedFormat, selectedQuality, videoInfo]);

  // Fetch video information
  const handleFetchInfo = useCallback(async (url: string) => {
    setIsFetching(true);
    setVideoInfo(null);
    setCurrentUrl(url);
    setDownloadComplete(false);

    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data: ApiResponse<VideoInfo> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch video information");
      }

      setVideoInfo(data.data);
      success("Video information loaded successfully!");
    } catch (err: any) {
      error(err.message || "Failed to fetch video information");
      setVideoInfo(null);
    } finally {
      setIsFetching(false);
    }
  }, [success, error]);

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!videoInfo || !selectedQuality) return;

    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      info("Preparing your download...", 3000);

      // Build download URL
      const params = new URLSearchParams({
        url: currentUrl,
        format: selectedFormat,
        quality: selectedQuality,
        title: videoInfo.title,
      });

      // Create a hidden link and trigger download
      const link = document.createElement("a");
      link.href = `/api/download?${params.toString()}`;
      link.download = `${videoInfo.title}.${selectedFormat === "video" ? "mp4" : "mp3"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success after a short delay
      setTimeout(() => {
        setDownloadComplete(true);
        success("Your download has started!");
        setIsDownloading(false);
      }, 1500);
    } catch (err: any) {
      error(err.message || "Download failed. Please try again.");
      setIsDownloading(false);
    }
  }, [videoInfo, selectedQuality, currentUrl, selectedFormat, info, success, error]);

  // Memoized format change handler
  const handleFormatChange = useCallback((format: FormatType) => {
    setSelectedFormat(format);
  }, []);

  // Memoized quality change handler
  const handleQualityChange = useCallback((quality: string) => {
    setSelectedQuality(quality);
  }, []);

  // Show features when no video loaded
  const showFeatures = !videoInfo && !isFetching;

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Download Videos
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Instantly
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Paste any video URL and download in your preferred format and quality.
            Fast, free, and no registration required.
          </p>
        </div>

        {/* URL Input Section */}
        <div className="mb-8">
          <UrlInput
            onSubmit={handleFetchInfo}
            isLoading={isFetching}
            disabled={isDownloading}
          />
        </div>

        {/* Ad Banner - Below Input */}
        <div className="mb-8">
          <AdBanner adSlot={AD_SLOT_1} adFormat="auto" className="rounded-xl overflow-hidden" />
        </div>

        {/* Video Info & Settings */}
        {videoInfo && (
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-slide-up">
            {/* Video Card */}
            <VideoCard video={videoInfo} />

            {/* Settings Panel */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Download Settings
              </h2>

              <FormatSelector
                selected={selectedFormat}
                onChange={handleFormatChange}
                disabled={isDownloading}
              />

              <QualitySelector
                options={qualityOptions}
                selected={selectedQuality}
                onChange={handleQualityChange}
                disabled={isDownloading}
                formatType={selectedFormat}
              />

              <DownloadButton
                onClick={handleDownload}
                isLoading={isDownloading}
                isComplete={downloadComplete}
                disabled={!selectedQuality}
                format={selectedFormat}
              />
            </div>
          </div>
        )}

        {/* Features Section */}
        {showFeatures && (
          <div className="mt-16 animate-fade-in">
            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              Why Choose Us?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Lightning Fast"
                description="High-speed downloads without waiting"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Secure & Private"
                description="No data stored, no tracking"
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="High Quality"
                description="Up to 4K video and 320kbps audio"
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="Multi-Platform"
                description="Works with YouTube, Vimeo & more"
              />
            </div>
          </div>
        )}

        {/* Supported Sites */}
        {showFeatures && (
          <div className="mt-16 text-center animate-fade-in">
            <p className="text-sm text-gray-500 mb-4">Supported platforms</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <span className="text-lg font-medium">YouTube</span>
              <span className="text-lg font-medium">Vimeo</span>
              <span className="text-lg font-medium">Twitter/X</span>
              <span className="text-lg font-medium">Reddit</span>
              <span className="text-sm text-gray-500">+ 1000 more</span>
            </div>
          </div>
        )}

        {/* Ad Banner - Bottom */}
        <div className="mt-12">
          <AdBanner adSlot={AD_SLOT_2} adFormat="auto" className="rounded-xl overflow-hidden" />
        </div>
      </div>
    </>
  );
}

