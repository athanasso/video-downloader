import { Globe, Check } from "lucide-react";

export default function SupportedSites() {
  const popularSites = [
    { name: "YouTube", description: "Videos, Shorts, Playlists" },
    { name: "Vimeo", description: "Videos, Showcases" },
    { name: "Twitter/X", description: "Video tweets" },
    { name: "Reddit", description: "Video posts" },
    { name: "TikTok", description: "Videos (no watermark)" },
    { name: "Instagram", description: "Reels, Stories, Posts" },
    { name: "Facebook", description: "Videos, Reels" },
    { name: "Twitch", description: "Clips, VODs" },
    { name: "Dailymotion", description: "Videos" },
    { name: "SoundCloud", description: "Audio tracks" },
    { name: "Bandcamp", description: "Music, Albums" },
    { name: "Bilibili", description: "Videos" },
  ];

  const categories = [
    {
      title: "Video Platforms",
      sites: ["YouTube", "Vimeo", "Dailymotion", "TikTok", "Bilibili", "Niconico"],
    },
    {
      title: "Social Media",
      sites: ["Twitter/X", "Facebook", "Instagram", "Reddit", "Pinterest", "LinkedIn"],
    },
    {
      title: "Streaming",
      sites: ["Twitch", "Kick", "Rumble", "Odysee"],
    },
    {
      title: "Audio",
      sites: ["SoundCloud", "Bandcamp", "Mixcloud", "Spotify (podcasts)"],
    },
    {
      title: "News & Media",
      sites: ["BBC", "CNN", "NBC", "CBS", "ABC News"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white text-center mb-4">
        Supported Sites
      </h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Download videos and audio from 1000+ websites. Here are some of the most popular ones.
      </p>

      {/* Popular Sites Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {popularSites.map((site, index) => (
          <div
            key={index}
            className="glass rounded-xl p-4 flex items-center gap-3 card-hover"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">{site.name}</h3>
              <p className="text-gray-500 text-sm">{site.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-semibold text-white text-center mb-8">
        All Categories
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {category.title}
            </h3>
            <ul className="space-y-2">
              {category.sites.map((site, siteIndex) => (
                <li key={siteIndex} className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4 text-green-400" />
                  {site}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-12 glass rounded-2xl p-6 text-center">
        <p className="text-gray-400">
          <span className="text-white font-medium">Not seeing your site?</span>{" "}
          We support over 1000 websites. Try pasting your URL and see if it works!
        </p>
      </div>
    </div>
  );
}
