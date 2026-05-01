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
- 🍪 **Cookie Auth** - Automatic `cookies.txt` support for YouTube bot detection bypass

## Prerequisites

| Requirement | Installation |
|-------------|--------------|
| Node.js 18+ | [nodejs.org](https://nodejs.org) |
| yt-dlp | `pip install yt-dlp` |
| FFmpeg | `winget install ffmpeg` |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## YouTube Cookie Setup

YouTube requires authentication to bypass bot detection. To set this up:

1. Install a cookie export extension (e.g. [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc))
2. Go to [youtube.com](https://youtube.com) and sign in
3. Click the extension icon and export cookies
4. Save the file as `cookies.txt` in the project root

> **Note:** The `cookies.txt` file contains sensitive session data and is excluded from git via `.gitignore`. Never share or commit this file.

For non-YouTube sites, cookies are not required.

## Project Structure

```
app/
├── api/
│   ├── info/route.ts       # Metadata API
│   ├── prepare/route.ts    # Download preparation with progress
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
