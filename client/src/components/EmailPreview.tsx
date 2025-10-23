import { Mail, AlertTriangle } from "lucide-react";
import { FadeIn } from "./FadeIn";

export function EmailPreview() {
  return (
    <FadeIn delay={0.2}>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Without InboxPass - Spam */}
        <div className="relative">
          <div className="absolute -top-3 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            WITHOUT INBOXPASS
          </div>
          <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50/50">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <h4 className="font-bold text-red-900">Spam Folder</h4>
                <p className="text-sm text-red-700">Your customers never see this</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 border border-red-200 opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Your Company
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Important update about your order...
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-red-200 opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Your Newsletter
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  This week's special offers...
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-100 rounded border border-red-200">
              <p className="text-xs text-red-800 font-medium">
                ⚠️ Lost sales, ignored updates, frustrated customers
              </p>
            </div>
          </div>
        </div>

        {/* With InboxPass - Inbox */}
        <div className="relative">
          <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            WITH INBOXPASS
          </div>
          <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50/50">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-bold text-green-900">Primary Inbox</h4>
                <p className="text-sm text-green-700">100% deliverability</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Your Company
                  </span>
                  <span className="ml-auto text-xs text-green-600 font-semibold">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Important update about your order...
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Your Newsletter
                  </span>
                  <span className="ml-auto text-xs text-green-600 font-semibold">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  This week's special offers...
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded border border-green-200">
              <p className="text-xs text-green-800 font-medium">
                ✓ Maximum engagement, trusted sender, happy customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

