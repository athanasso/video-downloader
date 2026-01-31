import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import AdSenseScript from "./components/AdSenseScript";
import "./globals.css";

// Optimize font loading with display swap
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://video-downloader.athanasso.dev"),
  title: {
    default: "Video Downloader | Download Videos & Audio from YouTube & More",
    template: "%s | Video Downloader",
  },
  description:
    "Free online video downloader. Download videos and audio from YouTube, Vimeo, Twitter, Reddit and 1000+ sites. Choose your preferred quality and format. No registration required.",
  keywords: [
    "video downloader",
    "youtube downloader",
    "mp3 converter",
    "mp4 download",
    "audio extractor",
    "free video download",
    "online video downloader",
    "4k video downloader",
    "vimeo downloader",
    "twitter video download",
  ],
  authors: [{ name: "athanasso", url: "https://github.com/athanasso" }],
  creator: "athanasso",
  publisher: "athanasso",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Video Downloader | Download Videos & Audio Free",
    description: "Download videos from YouTube, Vimeo, Twitter and 1000+ sites. Free, fast, and no registration required.",
    siteName: "Video Downloader",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Downloader | Download Videos & Audio Free",
    description: "Download videos from YouTube, Vimeo, Twitter and 1000+ sites. Free, fast, and no registration required.",
    creator: "@athanasso",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="glass border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </span>
                <span>
                  <span className="text-xl font-bold text-white block">Video Downloader</span>
                  <span className="text-xs text-gray-400 block">by <span className="text-primary-400">athanasso</span></span>
                </span>
              </Link>
              <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="hidden">athanasso</a>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm">
                  How it works
                </Link>
                <Link href="/supported-sites" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Supported Sites
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="glass border-t border-white/10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear() === 2026 ? '2026' : `2026-${new Date().getFullYear()}`} Video Downloader. For personal use only.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Developed by <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">athanasso</a>
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How it works
                  </Link>
                  <Link href="/supported-sites" className="text-gray-400 hover:text-white transition-colors">
                    Supported Sites
                  </Link>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
