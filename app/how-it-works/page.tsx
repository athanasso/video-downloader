import { Download, Search, Settings, Play } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "1. Paste URL",
      description: "Copy the video URL from YouTube, Vimeo, or any supported platform and paste it in the input field.",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "2. Choose Format",
      description: "Select your preferred format (MP4 for video, MP3 for audio) and quality (up to 4K or 320kbps).",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "3. Download",
      description: "Click the download button and your file will start downloading directly to your device.",
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "4. Enjoy",
      description: "Open the downloaded file with your favorite media player and enjoy offline!",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white text-center mb-4">
        How It Works
      </h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Download videos and audio in just a few simple steps. No registration required.
      </p>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="glass rounded-2xl p-6 flex items-start gap-6 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
              {step.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h2>
              <p className="text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Important Notes
        </h2>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Downloads are processed on our server and streamed directly to your browser
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Large files may take longer to process depending on your internet speed
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            Only download content you have the right to access
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="btn-gradient inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium"
        >
          <Download className="w-5 h-5" />
          Start Downloading
        </a>
      </div>
    </div>
  );
}
