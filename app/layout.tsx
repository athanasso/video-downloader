import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Downloader | Download Videos & Audio",
  description:
    "Download videos and audio from YouTube and other platforms. Choose your preferred quality and format.",
  keywords: ["video downloader", "youtube downloader", "mp3", "mp4", "audio extractor"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="glass border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
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
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Video Downloader</h1>
                  <p className="text-xs text-gray-400">by <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">athanasso</a></p>
                </div>
              </Link>
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
