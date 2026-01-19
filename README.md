# Video Downloader

A modern Next.js 14+ application for downloading videos and audio from YouTube and 1000+ other platforms.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- 🎬 **Video Downloads** - MP4 format up to 8K resolution
- 🎵 **Audio Extraction** - MP3 format up to 320kbps
- 🎨 **Modern UI** - Dark theme with glassmorphism design
- ⚡ **Fast Streaming** - Direct downloads, no waiting
- 🌐 **1000+ Sites** - YouTube, Vimeo, Twitter, TikTok, and more

## Prerequisites

| Requirement | Installation |
|-------------|--------------|
| Node.js 18+ | [nodejs.org](https://nodejs.org) |
| yt-dlp | `winget install yt-dlp` |
| FFmpeg | `winget install ffmpeg` |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/
│   ├── info/route.ts       # Metadata API
│   └── download/route.ts   # Download streaming
├── components/             # UI components
├── how-it-works/          # Guide page
├── supported-sites/       # Platforms list
├── privacy/               # Privacy policy
├── terms/                 # Terms of service
└── page.tsx               # Main page
```

## Developer

Created by [athanasso](https://github.com/athanasso)

## License

MIT - For personal use only. Respect copyright laws.
