import { FileText, AlertTriangle, Scale, User } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400">
          Last updated: January 2026
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <p className="text-gray-300 leading-relaxed">
          Welcome to Video Downloader, developed by{" "}
                    <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="text-primary-400 font-medium hover:underline">athanasso</a>. By
          using this service, you agree to these terms. Please read them
          carefully.
        </p>
      </div>

      <div className="space-y-6">
        {/* Acceptable Use */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Acceptable Use</h2>
          </div>
          <div className="text-gray-400 space-y-3">
            <p>You may use this service to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Download content you own or have rights to</li>
              <li>Download content that is freely available for personal use</li>
              <li>Create backups of your own content</li>
              <li>Download content with explicit permission from the owner</li>
            </ul>
          </div>
        </div>

        {/* Prohibited Use */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Prohibited Use</h2>
          </div>
          <div className="text-gray-400 space-y-3">
            <p>You may NOT use this service to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Download copyrighted content without permission</li>
              <li>Redistribute downloaded content commercially</li>
              <li>Circumvent digital rights management (DRM)</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Abuse or overload our servers</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center text-yellow-400">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Disclaimer</h2>
          </div>
          <div className="text-gray-400 space-y-3">
            <p>
              This service is provided &quot;as is&quot; without warranties of any kind.
              We are not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>How you use downloaded content</li>
              <li>Any copyright infringement by users</li>
              <li>Service interruptions or data loss</li>
              <li>Third-party content or websites</li>
            </ul>
          </div>
        </div>

        {/* User Responsibility */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-primary-400">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Your Responsibility</h2>
          </div>
          <div className="text-gray-400 space-y-3">
            <p>
              You are solely responsible for ensuring your use of this service
              complies with all applicable laws in your jurisdiction. By using
              this service, you agree to indemnify and hold harmless the
              developer from any claims arising from your use.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Info */}
      <div className="mt-8 glass rounded-2xl p-6 text-center">
        <p className="text-gray-400">
          Developed with ❤️ by{" "}
                    <a href="https://github.com/athanasso" target="_blank" rel="noopener noreferrer" className="text-primary-400 font-semibold hover:underline">athanasso</a>
        </p>
        <p className="text-gray-500 text-sm mt-2">
          For questions or concerns, please reach out to the developer.
        </p>
      </div>
    </div>
  );
}
