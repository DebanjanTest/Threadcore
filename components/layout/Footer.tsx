"use client";

import { useState } from "react";
import Link from "next/link";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import Button from "@/components/ui/Button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <footer className="border-t border-border-subtle bg-surface-1 text-foreground mt-auto">
        {/* Newsletter & Club Section */}
        <div className="border-b border-border-subtle bg-surface-2/30 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 block mb-2 font-bold">
                Join the Core Protocol
              </span>
              <h3 className="font-mono text-xl uppercase tracking-wider text-foreground mb-2">
                Unlock ₹200 Off Your First Drop
              </h3>
              <p className="font-mono text-xs text-text-secondary leading-relaxed">
                Be the first to access limited custom apparel drops, new printable silhouettes, and developer agent updates.
              </p>
            </div>

            <div className="w-full max-w-md">
              {subscribed ? (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 font-mono text-xs text-emerald-400 text-center">
                  ✓ Welcome to the syndicate! Use code <strong className="text-foreground">CORE20</strong> for 20% off your order.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL..."
                    className="flex-1 bg-surface-1 border border-border-subtle px-4 py-2.5 font-mono text-xs text-foreground placeholder:text-text-muted focus:outline-none focus:border-foreground"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="font-bold"
                  >
                    Join
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Philosophy */}
          <div>
            <Link
              href="/"
              className="font-mono text-base uppercase tracking-[0.25em] text-foreground font-bold block mb-4"
            >
              THREAD<span className="text-emerald-400 font-normal">{"//"}</span>CORE
            </Link>
            <p className="font-mono text-[11px] text-text-secondary leading-relaxed mb-6">
              Precision-engineered streetwear blanks & custom printables. Built for human creators and autonomous AI buyers with explainable pricing and bounded Razorpay guardrails.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted border border-border-subtle px-2 py-1">
                GST Registered
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted border border-border-subtle px-2 py-1">
                Pan-India Express
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted border border-border-subtle px-2 py-1">
                Razorpay Verified
              </span>
            </div>
          </div>

          {/* Col 2: Shop & Studio */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground mb-4 font-bold">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-text-secondary">
              <li>
                <Link href="/studio?sku=TC-TEE-001" className="hover:text-foreground transition-colors">
                  Heavyweight Boxy Tees (220 GSM)
                </Link>
              </li>
              <li>
                <Link href="/studio?sku=TC-HOD-001" className="hover:text-foreground transition-colors">
                  Technical Fleece Hoodies (320 GSM)
                </Link>
              </li>
              <li>
                <Link href="/studio?sku=TC-JER-001" className="hover:text-foreground transition-colors">
                  Performance Technical Jerseys
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-foreground transition-colors text-emerald-400">
                  Interactive Print Customizer ↗
                </Link>
              </li>
              <li>
                <Link href="/#specs" className="hover:text-foreground transition-colors">
                  Fabric & GSM Technical Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground mb-4 font-bold">
              Customer Service
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-text-secondary">
              <li>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="hover:text-foreground transition-colors text-left"
                >
                  Apparel Size Matrix & Fit Guide
                </button>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  Shipping Rates & Timelines (24h Dispatch)
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  Returns & 7-Day Replacement Policy
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  Print Care & Longevity Guide
                </Link>
              </li>
              <li>
                <span className="text-text-muted">Support: ops@threadcore.dev</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Agent & Developer Protocol */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground mb-4 font-bold">
              Autonomous Agent API
            </h4>
            <p className="font-mono text-[10px] text-text-muted leading-relaxed mb-4">
              Machine-transactable catalog with bounded financial ceilings (₹5,000 max) and explainable pricing breakdown.
            </p>
            <ul className="space-y-2 font-mono text-[11px] text-text-secondary">
              <li>
                <a
                  href="/api/agent/catalog"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-400">GET</span> /api/agent/catalog
                </a>
              </li>
              <li>
                <a
                  href="/api/agent/evaluate"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-400">POST</span> /api/agent/evaluate
                </a>
              </li>
              <li>
                <span className="text-text-muted">Budget Guardrail: ₹5,000 / order</span>
              </li>
              <li>
                <span className="text-text-muted">Track 01: Razorpay AI Buildathon</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-subtle py-6 px-6 bg-surface-2/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-text-muted uppercase tracking-wider">
            <div suppressHydrationWarning>
              © {new Date().getFullYear()} THREAD//CORE APPAREL STUDIO. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-6">
              <span>Prices Inclusive of 18% GST</span>
              <span>•</span>
              <span>256-Bit SSL Encrypted Razorpay Gateway</span>
            </div>
          </div>
        </div>
      </footer>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultType="tee"
      />
    </>
  );
}
