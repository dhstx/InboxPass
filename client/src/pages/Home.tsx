import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { CheckCircle2, XCircle, AlertCircle, Mail, Shield, FileText, Zap } from "lucide-react";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const scanMutation = trpc.scan.scanDomain.useMutation({
    onSuccess: (data: any) => {
      setResults(data);
      setScanning(false);
    },
    onError: () => {
      setScanning(false);
    },
  });

  const handleScan = () => {
    if (!domain.trim()) return;
    setScanning(true);
    setResults(null);
    scanMutation.mutate({ domain: domain.trim() });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-sm font-semibold text-red-700 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              URGENT: Gmail & Microsoft cracking down
            </div>

            <h1 className="heading-hero mb-6">
              YOUR EMAILS ARE
              <br />
              <span className="text-gradient">GOING TO SPAM.</span>
            </h1>

            <p className="text-body text-xl mb-12 max-w-2xl mx-auto">
              Gmail and Microsoft now require SPF, DKIM, DMARC, and BIMI. Missing even one? Your emails land in spam—or worse, get blocked entirely.
            </p>

            {/* Scanner */}
            <div className="max-w-2xl mx-auto">
              <div className="card-premium border-blue p-8">
                <h3 className="heading-card mb-4">Scan Your Domain (Free)</h3>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="yourdomain.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleScan()}
                    className="input-premium flex-1"
                    disabled={scanning}
                  />
                  <Button
                    onClick={handleScan}
                    disabled={scanning || !domain.trim()}
                    className="btn-premium btn-premium-primary min-w-[140px]"
                  >
                    {scanning ? "Scanning..." : "Scan Now"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  No signup required • Results in 10 seconds
                </p>
              </div>

              {/* Results */}
              {results && (
                <div className="mt-8 card-premium border-gold animate-fade-in-up">
                  <h3 className="heading-card mb-6">Compliance Report: {results.domain}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {results.tests.map((test: any) => (
                      <div key={test.type} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        {getStatusIcon(test.status)}
                        <div>
                          <p className="font-semibold text-sm">{test.type.toUpperCase()}</p>
                          <p className="text-xs text-gray-600">{test.status === "pass" ? "Configured" : "Missing"}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {results.overallStatus !== "pass" && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-center text-gray-700 mb-4">
                        <strong>Your emails are at risk.</strong> Get the full compliance kit for $29.
                      </p>
                      <Button className="btn-premium btn-premium-primary w-full">
                        Get Compliance Kit → $29
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-section text-center mb-12">
              THIS ISN'T A WARNING.
              <br />
              <span className="text-gradient-gold">IT'S A REVENUE PROBLEM.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-premium border-pink hover-lift">
                <div className="text-4xl mb-4">📉</div>
                <h3 className="heading-card mb-3">Lost Sales</h3>
                <p className="text-body">
                  Your checkout emails, order confirmations, and abandoned cart reminders never arrive.
                </p>
              </div>

              <div className="card-premium border-orange hover-lift">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="heading-card mb-3">Damaged Reputation</h3>
                <p className="text-body">
                  Spam complaints tank your sender score. Recovery takes months—if it's even possible.
                </p>
              </div>

              <div className="card-premium border-purple hover-lift">
                <div className="text-4xl mb-4">🚫</div>
                <h3 className="heading-card mb-3">Domain Blacklisted</h3>
                <p className="text-body">
                  Get flagged by Gmail or Microsoft, and your entire domain gets blocked permanently.
                </p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-lg font-semibold text-red-900 mb-4">
                Every day you wait, you're losing customers.
              </p>
              <ul className="space-y-2 text-red-800">
                <li>• Your welcome emails aren't welcoming anyone</li>
                <li>• Your password resets are creating support tickets</li>
                <li>• Your invoices are "lost" (they're in spam)</li>
                <li>• Your marketing campaigns are invisible</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-section mb-6">
              FIX IT IN 5 MINUTES FOR $29.
            </h2>
            <p className="text-body text-xl mb-12">
              No subscription. No recurring fees. One payment, lifetime compliance.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="heading-card mb-3">Scan</h3>
                <p className="text-body">
                  We check your SPF, DKIM, DMARC, and BIMI records in real-time.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="heading-card mb-3">Pay</h3>
                <p className="text-body">
                  $29 one-time. Get instant access to your custom compliance kit.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="heading-card mb-3">Fix</h3>
                <p className="text-body">
                  Copy and paste the records we provide into your DNS. Done.
                </p>
              </div>
            </div>

            {/* Sample Report CTA */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Not sure what you'll get?</p>
              <a
                href="/sample-compliance-report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-premium-secondary inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                View Sample Report
              </a>
              <p className="text-sm text-gray-500 mt-2">See exactly what you'll receive</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-section text-center mb-12">
              YOUR INSTANT "COMPLIANCE KIT" INCLUDES:
            </h2>

            <div className="space-y-4">
              {[
                { icon: <Mail />, title: "Copy-Paste SPF & DKIM Records", desc: "Exact DNS records for your ESP (Gmail, SendGrid, Mailgun, etc.)" },
                { icon: <Shield />, title: "Provider-Specific DNS Setup", desc: "Step-by-step guides for Google Workspace, M365, Cloudflare, and 20+ providers" },
                { icon: <CheckCircle2 />, title: "One-Click Unsubscribe Headers", desc: "RFC 8058 compliant code snippets you can drop into your app" },
                { icon: <FileText />, title: "Validation Checklist", desc: "A simple checklist to verify everything is working in under 5 minutes" },
                { icon: <Zap />, title: "Instant PDF Download", desc: "A well-formatted, professional compliance report you can share with your team" },
              ].map((item, i) => (
                <div key={i} className="card-premium border-blue flex items-start gap-4 hover-lift">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="heading-card mb-2">{item.title}</h3>
                    <p className="text-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-section text-center mb-12">
              WE DIDN'T MAKE THE RULES.
              <br />
              <span className="text-gradient-gold">WE JUST HELP YOU PASS THEM.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-premium border-pink p-6">
                <div className="flex items-start gap-3 mb-4">
                  <img src="https://www.google.com/favicon.ico" alt="Gmail" className="w-6 h-6" />
                  <h3 className="heading-card">Gmail</h3>
                </div>
                <p className="text-body text-sm italic">
                  "Bulk senders must authenticate email, make it easy to unsubscribe, and stay under a 0.3% spam rate."
                </p>
                <a href="https://support.google.com/a/answer/14229414" target="_blank" rel="noopener" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                  Read official policy →
                </a>
              </div>

              <div className="card-premium border-orange p-6">
                <div className="flex items-start gap-3 mb-4">
                  <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="w-6 h-6" />
                  <h3 className="heading-card">Microsoft</h3>
                </div>
                <p className="text-body text-sm italic">
                  "As of May 5, 2025, DMARC, SPF, and DKIM are required for high-volume senders."
                </p>
                <a href="https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730" target="_blank" rel="noopener" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                  Read official policy →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-section text-center mb-12">
              TRUSTED BY EMAIL SENDERS WORLDWIDE
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { name: "Sarah K.", role: "SaaS Founder", quote: "Went from 60% spam rate to inbox in 24 hours. Worth every penny." },
                { name: "Mike T.", role: "E-commerce Owner", quote: "Our abandoned cart emails finally work. ROI paid for itself in one day." },
                { name: "Jessica L.", role: "Marketing Director", quote: "Clear, actionable, no fluff. Exactly what we needed." },
              ].map((testimonial, i) => (
                <div key={i} className="card-premium border-gold p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-body mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-12 text-center">
              <div>
                <p className="text-4xl font-bold text-gradient">1,247+</p>
                <p className="text-sm text-gray-600">Domains Scanned</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient">98%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient">4.9/5</p>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-premium bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Don't Lose Another Sale to the Spam Folder.
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Scan your domain now. Fix it in 5 minutes. $29 one-time.
            </p>

            <div className="card-premium bg-white/10 backdrop-blur-lg border-white/20 p-8">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="yourdomain.com"
                  className="input-premium flex-1 bg-white text-gray-900"
                />
                <Button className="btn-premium bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
                  Scan Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-4">© 2025 InboxPass. All rights reserved.</p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/refund-policy" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:support@inboxpass.org" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

