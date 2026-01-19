import { Shield, Eye, Lock, Server, Trash2 } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Information We Collect",
      content: `We collect minimal information necessary to provide our service:
      
• **URLs you submit**: Temporarily processed to fetch video information
• **Technical data**: Browser type, device info for compatibility
• **Usage analytics**: Anonymous data to improve our service

We do NOT collect personal information like names, emails, or payment details.`,
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "How We Use Your Data",
      content: `Your data is used solely for:

• Processing your download requests
• Improving service performance and reliability
• Debugging technical issues
• Analyzing anonymous usage patterns

We never sell, share, or monetize your personal data.`,
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      title: "Data Retention",
      content: `We believe in minimal data retention:

• **Video URLs**: Deleted immediately after processing
• **Downloaded files**: Never stored on our servers
• **Logs**: Automatically purged after 7 days
• **Analytics**: Aggregated and anonymized`,
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Security",
      content: `We take security seriously:

• All connections are encrypted via HTTPS
• No user accounts or passwords to protect
• Regular security audits and updates
• No third-party trackers or advertisements`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400">
          Last updated: January 2026
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <p className="text-gray-300 leading-relaxed">
          At Video Downloader, we respect your privacy, built and maintained by{" "}
          <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="text-primary-400 font-medium hover:underline">athanasso</a>. This
          policy explains what information we collect, how we use it, and your
          rights regarding your data. We&apos;re committed to transparency and
          protecting your privacy.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-primary-400">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>
            </div>
            <div className="text-gray-400 whitespace-pre-line leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
        <p className="text-gray-400">
          If you have questions about this privacy policy, please contact the
          developer:{" "}
                    <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="text-primary-400 font-medium hover:underline">athanasso</a>
        </p>
      </div>
    </div>
  );
}
