"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

interface NavbarProps {
  onOpenCatalogSchema?: () => void;
  onOpenAutopilot?: () => void;
}

const emptySubscribe = () => () => {};

export default function Navbar({ onOpenCatalogSchema, onOpenAutopilot }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // useSyncExternalStore ensures exact SSR match (0 count during hydration) without triggering set-state-in-effect
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <>
      {/* ─── ANNOUNCEMENT BAR ─── */}
      {!announcementDismissed && (
        <div className="bg-surface-3 border-b border-border-subtle py-1.5 px-4 text-center relative font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary flex items-center justify-between">
          <div className="mx-auto flex items-center gap-3">
            <span className="text-amber-400 font-bold">⚡ RAZORPAY AI BUILDATHON 2026</span>
            <span className="hidden sm:inline text-text-muted">|</span>
            <span className="hidden sm:inline">TRACK 01: AGENTIC COMMERCE</span>
            <span className="text-text-muted">|</span>
            <span>UAP PROTOCOL <strong className="text-foreground font-bold">ENABLED</strong></span>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            aria-label="Dismiss announcement"
            className="text-text-muted hover:text-foreground text-xs px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── MAIN NAVIGATION ─── */}
      <nav className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="font-mono text-base font-bold uppercase tracking-[0.2em] text-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>THREAD</span>
              <span className="text-amber-500 font-normal">{"//"}</span>
              <span>CORE</span>
            </Link>
          </div>

          {/* Amazon / Flipkart Style Central Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search tees, technical hoodies, jerseys, custom prints..."
                className="w-full bg-surface-2 border border-border-subtle hover:border-border focus:border-amber-500 focus:outline-hidden text-xs text-foreground px-3.5 py-2 pr-9 rounded-sm placeholder:text-text-muted transition-colors font-sans"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push("/#collection");
                  }
                }}
              />
              <button
                onClick={() => {
                  router.push("/#collection");
                }}
                className="absolute right-1 text-text-muted hover:text-foreground p-1 cursor-pointer"
                title="Search collection"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-4 text-xs tracking-wider uppercase text-text-secondary font-medium shrink-0">
            <Link
              href="/#collection"
              className="hover:text-foreground transition-colors py-1"
            >
              Collection
            </Link>
            <Link
              href="/studio?sku=TC-TEE-001"
              className="hover:text-foreground transition-colors py-1"
            >
              Tees
            </Link>
            <Link
              href="/studio?sku=TC-HOD-001"
              className="hover:text-foreground transition-colors py-1"
            >
              Hoodies
            </Link>
            <Link
              href="/studio?sku=TC-JER-001"
              className="hover:text-foreground transition-colors py-1"
            >
              Jerseys
            </Link>
            <Link
              href="/studio"
              className={`py-1 px-2.5 rounded-sm transition-all ${
                pathname === "/studio"
                  ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30"
                  : "border border-border-subtle hover:border-border hover:text-foreground"
              }`}
            >
              Studio ✦
            </Link>
          </div>

          {/* Right Actions: AI Buyer + Schema + Cart Bag + Mobile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenAutopilot && (
              <button
                onClick={onOpenAutopilot}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Launch in-browser Autonomous AI Buyer Agent"
              >
                <span>⚡</span>
                <span>AI Buyer</span>
              </button>
            )}

            {onOpenCatalogSchema && (
              <button
                onClick={onOpenCatalogSchema}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border-subtle bg-surface-2 hover:bg-surface-3 hover:border-border text-xs text-text-secondary hover:text-foreground transition-all cursor-pointer font-mono"
                title="View machine-readable JSON schema for autonomous agents"
              >
                <span>{"{ }"}</span>
                <span>API</span>
              </button>
            )}

            {/* Shopping Bag Button (Amazon/Flipkart Cart Pill) */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping bag"
              className="relative flex items-center gap-2 px-3.5 py-1.5 bg-foreground text-background text-xs font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-sm cursor-pointer rounded-sm border border-white/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart</span>
              <span
                suppressHydrationWarning
                className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold"
              >
                {isMounted ? cartCount : 0}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-8 h-8 flex items-center justify-center border border-border-subtle text-foreground text-sm hover:bg-surface-2 rounded-xs"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-subtle bg-surface-1 px-5 py-4 flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
            <Link
              href="/#collection"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border-subtle/50 text-text-secondary hover:text-foreground"
            >
              Collection
            </Link>
            <Link
              href="/studio?sku=TC-TEE-001"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border-subtle/50 text-text-secondary hover:text-foreground"
            >
              Heavyweight Tees
            </Link>
            <Link
              href="/studio?sku=TC-HOD-001"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border-subtle/50 text-text-secondary hover:text-foreground"
            >
              Technical Hoodies
            </Link>
            <Link
              href="/studio?sku=TC-JER-001"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border-subtle/50 text-text-secondary hover:text-foreground"
            >
              Performance Jerseys
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-border-subtle/50 text-emerald-400 font-bold flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Transaction Monitor (/dashboard)
            </Link>
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 bg-foreground text-background font-bold text-center mt-1"
            >
              Enter Custom Studio ✦
            </Link>
            {onOpenAutopilot && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAutopilot();
                }}
                className="py-2 px-3 rounded-xs bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-400 font-bold text-left flex items-center gap-2 cursor-pointer"
              >
                <span>⚡</span>
                <span>Run AI Buyer Autopilot</span>
              </button>
            )}
            {onOpenCatalogSchema && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCatalogSchema();
                }}
                className="py-2 text-left font-mono text-[10px] text-text-muted hover:text-foreground flex items-center gap-1.5 cursor-pointer"
              >
                <span>{"{ }"}</span> View Agent Catalog Schema
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
