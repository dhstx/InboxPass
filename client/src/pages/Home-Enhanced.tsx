import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { CheckCircle2, XCircle, AlertCircle, Mail, Shield, FileText, Zap, ArrowRight } from "lucide-react";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { FadeIn } from "@/components/FadeIn";
import { CopyButton } from "@/components/CopyButton";
import { ComplianceScore } from "@/components/ComplianceScore";
import { EmailPreview } from "@/components/EmailPreview";

export default function HomeEnhanced() {
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

  const calculateOverallScore = () => {
    if (!results) return 0;
    const tests = [results.spf, results.dmarc, results.dkim];
    const passCount = tests.filter((t) => t?.status === "pass").length;
    return Math.round((passCount / tests.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Animated Gradient Background */}
      <AnimatedGradient />

      {/* Hero Section */}
      <section className="section-premium relative z-10">
        <div className="container-premium">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-sm font-semibold text-red-700 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                URGENT: Gmail & Microsoft cracking down
              </div>

              <h1 className="heading-premium mb-6">
                YOUR EMAILS ARE
                <br />
                <span className="text-gradient">GOING TO SPAM.</span>
              </h1>

              <p className="text-premium mb-12">
                Gmail and Microsoft require SPF, DKIM, and DMARC. Missing them?
                <br />
                <strong>Your emails aren't reaching customers.</strong> Missing sales isn't an option.
              </p>

              {/* Domain Scanner */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="yourdomain.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleScan()}
                    className="flex-1 h-14 text-lg"
                    disabled={scanning}
                  />
                  <Button
                    onClick={handleScan}
                    disabled={scanning || !domain.trim()}
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {scanning ? "Scanning..." : "Scan Now (Free)"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  No signup required • Takes 10 seconds
                </p>
              </div>

              {/* Scan Results */}
              {results && (
                <FadeIn delay={0.2}>
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                    <h3 className="text-2xl font-bold mb-6">
                      Compliance Report for {results.domain}
                    </h3>

                    {/* Compliance Scores */}
                    <div className="grid grid-cols-3 gap-8 mb-8">
                      <ComplianceScore
                        label="SPF"
                        score={results.spf?.status === "pass" ? 100 : 0}
                        color="#10b981"
                        delay={0}
                      />
                      <ComplianceScore
                        label="DKIM"
                        score={results.dkim?.status === "pass" ? 100 : 0}
                        color="#3b82f6"
                        delay={0.1}
                      />
                      <ComplianceScore
                        label="DMARC"
                        score={results.dmarc?.status === "pass" ? 100 : 0}
                        color="#8b5cf6"
                        delay={0.2}
                      />
                    </div>

                    {/* Overall Score */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-8">
                      <p className="text-lg font-semibold mb-2">
                        Overall Compliance Score
                      </p>
                      <p className="text-4xl font-bold text-gradient">
                        {calculateOverallScore()}%
                      </p>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4 text-left">
                      {[
                        { key: "spf", label: "SPF Record" },
                        { key: "dkim", label: "DKIM Record" },
                        { key: "dmarc", label: "DMARC Record" },
                      ].map((test) => {
                        const result = results[test.key];
                        return (
                          <div
                            key={test.key}
                            className="p-4 border-2 rounded-lg"
                            style={{
                              borderColor:
                                result?.status === "pass"
                                  ? "#10b981"
                                  : "#ef4444",
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(result?.status)}
                                <span className="font-semibold">
                                  {test.label}
                                </span>
                              </div>
                              {result?.record && (
                                <CopyButton
                                  text={result.record}
                                  label="Copy Record"
                                />
                              )}
                            </div>
                            {result?.record && (
                              <code className="text-xs bg-gray-100 p-2 rounded block mt-2 overflow-x-auto">
                                {result.record}
                              </code>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    {calculateOverallScore() < 100 && (
                      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                        <h4 className="text-xl font-bold mb-2">
                          Fix It in 5 Minutes for $29
                        </h4>
                        <p className="mb-4">
                          Get copy-paste DNS records, step-by-step setup guides,
                          and validation checklist.
                        </p>
                        <Button
                          size="lg"
                          className="bg-white text-blue-600 hover:bg-gray-100"
                        >
                          Get Compliance Kit →
                        </Button>
                      </div>
                    )}
                  </div>
                </FadeIn>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Email Preview Section */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <FadeIn>
            <h2 className="heading-premium text-center mb-4">
              THIS ISN'T A WARNING.
              <br />
              <span className="text-gradient">IT'S A REVENUE PROBLEM.</span>
            </h2>
          </FadeIn>
          <EmailPreview />
        </div>
      </section>

      {/* Problem Section */}
      <FadeIn delay={0.1}>
        <section className="section-premium">
          <div className="container-premium">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Every day you're not compliant, you're losing customers:
              </h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-2xl">•</span>
                  <span>
                    Your welcome emails aren't welcoming anyone
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-2xl">•</span>
                  <span>
                    Your invoices are "lost" (they're in spam)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-2xl">•</span>
                  <span>
                    Your marketing campaigns are invisible
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-2xl">•</span>
                  <span>
                    Your customers think <strong>you</strong> ghosted{" "}
                    <strong>them</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Solution Section */}
      <section className="section-premium bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-premium">
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-premium mb-6">
                FIX IT IN 5 MINUTES FOR{" "}
                <span className="text-gradient">$29.</span>
              </h2>
              <p className="text-premium mb-12">
                No subscriptions. No recurring fees. One payment. Instant
                compliance.
              </p>

              {/* 3-Step Process */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    num: "1",
                    title: "Scan",
                    desc: "We check your SPF, DKIM, DMARC, BIMI. See exactly what needs to be fixed.",
                    color: "blue",
                  },
                  {
                    num: "2",
                    title: "Pay",
                    desc: "$29 one-time. Get instant access to your complete compliance kit.",
                    color: "green",
                  },
                  {
                    num: "3",
                    title: "Fix",
                    desc: "Copy and paste the records we provide into your DNS. Done in 5 minutes.",
                    color: "purple",
                  },
                ].map((step, i) => (
                  <FadeIn key={i} delay={0.1 * i}>
                    <div className={`card-premium border-${step.color}-200`}>
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
                      >
                        {step.num}
                      </div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-6 h-auto"
              >
                Get Your Compliance Kit Now →
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-premium">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 InboxPass. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/refund-policy">
                <a className="text-gray-400 hover:text-white">Refund Policy</a>
              </Link>
              <Link href="/privacy-policy">
                <a className="text-gray-400 hover:text-white">Privacy</a>
              </Link>
              <a
                href="mailto:support@inboxpass.org"
                className="text-gray-400 hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

