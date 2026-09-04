"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProductCard from "@/components/product/ProductCard";
import GarmentPreview from "@/components/product/GarmentPreview";
import type { CatalogResponse } from "@/lib/types";
import { APPAREL_SKUS, APPAREL_COLORS } from "@/lib/catalog-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRESET_DESIGNS } from "@/lib/preset-designs";
import EditorialBentoGallery from "@/components/home/EditorialBentoGallery";
import Button from "@/components/ui/Button";
import AgentAutopilotModal from "@/components/studio/AgentAutopilotModal";

const Garment3DCanvas = dynamic(() => import("@/components/product/Garment3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-surface-1 border border-border-subtle flex flex-col items-center justify-center font-mono text-[9px] uppercase text-text-muted gap-2">
      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      <span>Loading 3D Turntable...</span>
    </div>
  ),
});

export default function HomePage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autopilotOpen, setAutopilotOpen] = useState(false);

  // Hero interactive state
  const [heroColor, setHeroColor] = useState(APPAREL_COLORS[0]);
  const [heroType, setHeroType] = useState<"tee" | "hoodie" | "jersey">("tee");
  const [heroCanvasMode, setHeroCanvasMode] = useState<"2d" | "3d">("3d");

  // Collection filtering & sorting
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/catalog");
      const data = await res.json();
      setCatalog(data);
      setShowCatalog(true);
    } catch {
      console.error("Failed to fetch catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...APPAREL_SKUS];
    if (selectedCategory !== "all") {
      list = list.filter((item) => item.category === selectedCategory || item.type === selectedCategory);
    }
    if (sortBy === "price-low") {
      list.sort((a, b) => a.basePricePaise - b.basePricePaise);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.basePricePaise - a.basePricePaise);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [selectedCategory, sortBy]);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── GLOBAL NAV ─── */}
      <Navbar
        onOpenCatalogSchema={fetchCatalog}
        onOpenAutopilot={() => setAutopilotOpen(true)}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-surface-1/40">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 dot-grid opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Headline, Value Props & CTAs */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.35em] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3 py-1 mb-6 rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Razorpay AI Buildathon 2026 • Track 01 Agentic Commerce</span>
              </div>

              <h1 className="font-mono text-4xl sm:text-6xl xl:text-7xl uppercase tracking-tight text-foreground leading-[0.95] mb-6 font-bold">
                PRECISION
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">STREETWEAR</span>
                <br />
                & CUSTOM CORE
              </h1>

              <p className="font-mono text-xs sm:text-sm text-text-secondary max-w-lg leading-relaxed mb-8 mx-auto lg:mx-0">
                Ultra-heavyweight 220–320 GSM ring-spun blanks, 300+ DPI digital print techniques, and 1-click Razorpay checkout. Engineered for human designers and autonomous AI buyers under strict financial guardrails.
              </p>

              {/* Value metrics */}
              <div className="grid grid-cols-3 gap-3 max-w-md mb-8 mx-auto lg:mx-0">
                <div className="border border-border-subtle bg-surface-2 p-3 text-center rounded-xs">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block mb-1">
                    Fabric Density
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    220–320 GSM
                  </span>
                </div>
                <div className="border border-border-subtle bg-surface-2 p-3 text-center rounded-xs">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block mb-1">
                    Minimum Order
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    1 Piece (0 MOQ)
                  </span>
                </div>
                <div className="border border-border-subtle bg-surface-2 p-3 text-center rounded-xs">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block mb-1">
                    Budget Ceiling
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-400">
                    ₹5,000 Hard Gated
                  </span>
                </div>
              </div>

              {/* Flipkart / Amazon Style CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link href="/studio">
                  <Button variant="buy" size="lg" className="font-bold text-xs shadow-md">
                    Enter Custom Studio ✦
                  </Button>
                </Link>

                <Button
                  variant="cart"
                  size="lg"
                  onClick={() => setAutopilotOpen(true)}
                  className="font-bold text-xs shadow-xs"
                >
                  ⚡ Run AI Buyer Autopilot
                </Button>

                <Link href="/#collection">
                  <Button variant="secondary" size="lg" className="text-xs">
                    Shop Collection ↓
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  loading={loading}
                  onClick={fetchCatalog}
                  className="text-xs"
                >
                  Agent API ↗
                </Button>
              </div>
            </div>

            {/* Right: Interactive Hero Garment Visualizer */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-sm bg-gradient-to-b from-surface-2/80 to-surface-1 border border-border-subtle p-6 shadow-2xl relative flex flex-col">
                {/* Mode & Silhouette selector row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {/* Silhouette selector pill */}
                  <div className="flex gap-1 border border-border-subtle bg-surface-3/60 p-1">
                    <button
                      onClick={() => setHeroType("tee")}
                      className={`px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                        heroType === "tee" ? "bg-foreground text-background font-bold" : "text-text-muted hover:text-foreground"
                      }`}
                    >
                      Tee
                    </button>
                    <button
                      onClick={() => setHeroType("hoodie")}
                      className={`px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                        heroType === "hoodie" ? "bg-foreground text-background font-bold" : "text-text-muted hover:text-foreground"
                      }`}
                    >
                      Hoodie
                    </button>
                    <button
                      onClick={() => setHeroType("jersey")}
                      className={`px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                        heroType === "jersey" ? "bg-foreground text-background font-bold" : "text-text-muted hover:text-foreground"
                      }`}
                    >
                      Jersey
                    </button>
                  </div>

                  {/* 2D vs 3D Mode Toggle */}
                  <div className="flex gap-1 border border-border-subtle bg-surface-3/60 p-1">
                    <button
                      onClick={() => setHeroCanvasMode("3d")}
                      className={`px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider transition-colors ${
                        heroCanvasMode === "3d"
                          ? "bg-emerald-400 text-black font-bold"
                          : "text-text-muted hover:text-foreground"
                      }`}
                    >
                      3D R3F
                    </button>
                    <button
                      onClick={() => setHeroCanvasMode("2d")}
                      className={`px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider transition-colors ${
                        heroCanvasMode === "2d"
                          ? "bg-foreground text-background font-bold"
                          : "text-text-muted hover:text-foreground"
                      }`}
                    >
                      2D Flat
                    </button>
                  </div>
                </div>

                {/* Main Visualizer Area */}
                <div className="w-full flex justify-center py-2 h-72 relative">
                  {heroCanvasMode === "3d" ? (
                    <Garment3DCanvas
                      garmentType={heroType}
                      colorHex={heroColor.hex}
                      designUrl={PRESET_DESIGNS[1].dataUrl}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GarmentPreview
                        type={heroType}
                        color={heroColor.hex}
                        colorId={heroColor.id}
                        designUrl={PRESET_DESIGNS[1].dataUrl}
                        size="md"
                        interactive={false}
                      />
                    </div>
                  )}
                </div>

                {/* Color swatch picker directly in hero */}
                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                      Color:
                    </span>
                    <div className="flex gap-2">
                      {APPAREL_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setHeroColor(c)}
                          title={c.name}
                          className={`w-4 h-4 border transition-all ${
                            heroColor.id === c.id
                              ? "border-foreground scale-125 ring-1 ring-foreground"
                              : "border-border-subtle hover:border-border"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/studio?sku=${heroType === "tee" ? "TC-TEE-001" : heroType === "hoodie" ? "TC-HOD-001" : "TC-JER-001"}&color=${heroColor.id}`}
                    className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2"
                  >
                    Customize in Studio →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── E-COMMERCE VALUE & TRUST BAR ─── */}
      <section className="border-b border-border-subtle bg-surface-2/60 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-border-subtle flex items-center justify-center font-mono text-sm text-emerald-400 shrink-0 bg-surface-1">
              ⚡
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                24h Dispatch
              </h4>
              <p className="font-mono text-[10px] text-text-muted">
                Pan-India express delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-border-subtle flex items-center justify-center font-mono text-sm text-emerald-400 shrink-0 bg-surface-1">
              🛡️
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                Heavyweight Ring-Spun
              </h4>
              <p className="font-mono text-[10px] text-text-muted">
                100% combed 220–320 GSM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-border-subtle flex items-center justify-center font-mono text-sm text-emerald-400 shrink-0 bg-surface-1">
              🎨
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                High-Density Print
              </h4>
              <p className="font-mono text-[10px] text-text-muted">
                Fade-resistant DTG & Sublimation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-border-subtle flex items-center justify-center font-mono text-sm text-emerald-400 shrink-0 bg-surface-1">
              🔒
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                Razorpay Protected
              </h4>
              <p className="font-mono text-[10px] text-text-muted">
                Bounded spending guardrails
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED APPAREL COLLECTION ─── */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border-subtle">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 mb-2 font-bold">
              Core Blanks Catalog
            </div>
            <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground font-bold">
              Featured Apparel
            </h2>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
            {/* Category tabs */}
            <div className="flex border border-border-subtle bg-surface-2 p-0.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 transition-colors ${
                  selectedCategory === "all"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                All ({APPAREL_SKUS.length})
              </button>
              <button
                onClick={() => setSelectedCategory("tees")}
                className={`px-3 py-1.5 transition-colors ${
                  selectedCategory === "tees"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Tees
              </button>
              <button
                onClick={() => setSelectedCategory("hoodies")}
                className={`px-3 py-1.5 transition-colors ${
                  selectedCategory === "hoodies"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Hoodies
              </button>
              <button
                onClick={() => setSelectedCategory("jerseys")}
                className={`px-3 py-1.5 transition-colors ${
                  selectedCategory === "jerseys"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Jerseys
              </button>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <span className="text-text-muted hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-2 border border-border-subtle px-3 py-1.5 font-mono text-[10px] text-foreground uppercase tracking-wider focus:outline-none focus:border-foreground"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map((sku, i) => (
            <ProductCard key={sku.id} sku={sku} index={i} />
          ))}
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="section-divider mx-6" />

      {/* ─── EDITORIAL LOOKBOOK BENTO GALLERY (Inspired by 21st.dev) ─── */}
      <EditorialBentoGallery />

      {/* ─── SECTION DIVIDER ─── */}
      <div className="section-divider mx-6" />

      {/* ─── PRESET GRAPHIC STAMPS / INSPIRATION SHOWCASE ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 mb-2 font-bold">
            Print Ready Graphics
          </div>
          <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground font-bold mb-3">
            Curated Graphic Library
          </h2>
          <p className="font-mono text-xs text-text-secondary leading-relaxed">
            Don&apos;t have vector artwork ready? Choose from our curated catalog of high-contrast cyberpunk and minimalist stamps to apply with 1-click in the Custom Studio.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRESET_DESIGNS.map((preset) => (
            <Link
              key={preset.id}
              href={`/studio?preset=${preset.id}`}
              className="border border-border-subtle bg-surface-1 p-4 flex flex-col items-center gap-3 hover:border-foreground transition-all duration-200 group"
            >
              <div className="w-20 h-20 bg-surface-2 border border-border-subtle p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.dataUrl}
                  alt={preset.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold block group-hover:text-emerald-400 transition-colors">
                  {preset.name}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                  {preset.category}
                </span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-wider text-text-secondary group-hover:text-foreground mt-1 border-b border-transparent group-hover:border-foreground">
                Apply in Studio →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="section-divider mx-6" />

      {/* ─── FABRIC ENGINEERING & TECHNICAL SPECS ─── */}
      <section id="specs" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 mb-2 font-bold">
              Materials & Construction
            </div>
            <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground font-bold mb-4">
              Engineered For Longevity
            </h2>
            <p className="font-mono text-xs text-text-secondary leading-relaxed mb-8">
              Every garment in our catalog is custom milled to our exact density and silhouette specifications. No flimsy poly blends or shrinking collars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border-subtle bg-surface-1 p-4">
                <span className="font-mono text-xs font-bold text-foreground block mb-1">
                  100% Combed Ring-Spun Cotton
                </span>
                <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                  Long-staple fibers combed to eliminate short strands, producing an ultra-smooth surface for razor-sharp ink adhesion.
                </p>
              </div>

              <div className="border border-border-subtle bg-surface-1 p-4">
                <span className="font-mono text-xs font-bold text-foreground block mb-1">
                  1.25&quot; Heavy Collar Ribbing
                </span>
                <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                  Dense elastane-infused rib-knit collar that maintains its crisp structure through 50+ wash cycles without baconing.
                </p>
              </div>

              <div className="border border-border-subtle bg-surface-1 p-4">
                <span className="font-mono text-xs font-bold text-foreground block mb-1">
                  Twin-Needle Flatlock Stitching
                </span>
                <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                  Reinforced shoulder-to-shoulder tape and hem lines engineered to withstand high torque and athletic movement.
                </p>
              </div>

              <div className="border border-border-subtle bg-surface-1 p-4">
                <span className="font-mono text-xs font-bold text-foreground block mb-1">
                  Pre-Shrunk Enzymatic Wash
                </span>
                <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                  Finished with an organic bio-enzyme bath that guarantees &lt;2% residual shrinkage and a broken-in buttery hand feel.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-surface-1 border border-border-subtle p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted block mb-2">
                Techwear Density Chart
              </span>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-text-secondary mb-1">
                    <span>Performance Jersey</span>
                    <span className="font-bold text-foreground">180 GSM Micro-Poly</span>
                  </div>
                  <div className="w-full h-2 bg-surface-3">
                    <div className="h-full bg-emerald-500 w-[55%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-text-secondary mb-1">
                    <span>Heavyweight Boxy Tee</span>
                    <span className="font-bold text-foreground">220 GSM Compact Cotton</span>
                  </div>
                  <div className="w-full h-2 bg-surface-3">
                    <div className="h-full bg-foreground w-[75%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-text-secondary mb-1">
                    <span>Technical French Terry Hoodie</span>
                    <span className="font-bold text-foreground">320 GSM Heavy Fleece</span>
                  </div>
                  <div className="w-full h-2 bg-surface-3">
                    <div className="h-full bg-emerald-400 w-[100%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-subtle flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                Need specific sizing?
              </span>
              <Link
                href="/studio"
                className="font-mono text-[10px] uppercase tracking-wider text-foreground hover:underline underline-offset-2"
              >
                Launch Studio Customizer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="section-divider mx-6" />

      {/* ─── CUSTOMER REVIEWS & SOCIAL PROOF ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 mb-2 font-bold">
            Verified Feedback
          </div>
          <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground font-bold mb-2">
            Loved By Humans & AI Buyers
          </h2>
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm">
            <span>★★★★★</span>
            <span className="font-mono text-xs text-text-secondary">4.92 / 5.0 Average Rating (340+ orders)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="border border-border-subtle bg-surface-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 text-xs">{"★".repeat(rev.rating)}</div>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5">
                    Verified Buyer
                  </span>
                </div>
                <p className="font-mono text-xs text-text-secondary leading-relaxed mb-6">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div className="border-t border-border-subtle/60 pt-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-foreground block">
                    {rev.author}
                  </span>
                  <span className="font-mono text-[9px] text-text-muted">
                    {rev.location}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-text-muted border border-border-subtle px-2 py-0.5">
                  {rev.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="section-divider mx-6" />

      {/* ─── FAQS SECTION ─── */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 w-full">
        <div className="text-center mb-12">
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 mb-2 font-bold">
            Frequently Asked Questions
          </div>
          <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground font-bold">
            Got Questions? We&apos;ve Got Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-border-subtle bg-surface-1 transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-mono text-xs uppercase tracking-wider text-foreground font-semibold hover:bg-surface-2/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-emerald-400 text-sm ml-4 font-mono">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 font-mono text-xs text-text-secondary leading-relaxed border-t border-border-subtle/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── AGENT DEVELOPER API CTA ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="border border-border-subtle bg-surface-1 p-8 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative max-w-2xl mx-auto">
            <div className="font-mono text-[9px] uppercase tracking-[0.5em] text-emerald-400 mb-2 font-bold">
              Track 01 • Razorpay AI Buildathon
            </div>
            <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground mb-3 font-bold">
              Autonomous Agent Transactability
            </h2>
            <p className="font-mono text-xs text-text-secondary leading-relaxed mb-8">
              ThreadCore isn&apos;t just an e-commerce store. It is fully integrated with an autonomous Agent Protocol. AI agents can fetch live catalog schemas, validate canvas boundaries, calculate itemized tax breakdowns, and execute bounded Razorpay transactions under ₹5,000.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={fetchCatalog}
                className="px-5 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-wider font-bold hover:bg-zinc-200 transition-colors"
              >
                {loading ? "Fetching Schema..." : "Inspect Catalog Schema (JSON)"}
              </button>
              <Link
                href="/studio"
                className="px-5 py-3 border border-border bg-surface-2 hover:bg-surface-3 font-mono text-xs uppercase tracking-wider text-foreground font-semibold transition-colors"
              >
                Launch Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <Footer />

      {/* ─── CATALOG SCHEMA MODAL ─── */}
      {showCatalog && catalog && (
        <div
          className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-6 backdrop-blur-md"
          onClick={() => setShowCatalog(false)}
        >
          <div
            className="bg-surface-1 border border-border max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-surface-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-primary">
                <span className="text-emerald-400">{"{ }"}</span>
                <span>Agent Catalog Protocol Schema v1.0</span>
              </div>
              <button
                onClick={() => setShowCatalog(false)}
                className="font-mono text-xs text-text-muted hover:text-foreground"
              >
                [✕]
              </button>
            </div>
            <pre className="p-5 font-mono text-[10px] text-text-secondary overflow-auto leading-relaxed flex-1">
              {JSON.stringify(catalog, null, 2)}
            </pre>
            <div className="px-5 py-3 border-t border-border-subtle bg-surface-2/40 flex justify-between items-center font-mono text-[9px] text-text-muted">
              <span>GET /api/agent/catalog</span>
              <span>Ceiling: ₹5,000 max</span>
            </div>
          </div>
        </div>
      )}


      {/* ─── 21ST.DEV AGENT AUTOPILOT MODAL ─── */}
      <AgentAutopilotModal
        isOpen={autopilotOpen}
        onClose={() => setAutopilotOpen(false)}
        onApplyConfig={(cfg) => {
          router.push(`/studio?sku=${cfg.selectedSKU || "TC-TEE-001"}`);
        }}
        onAddAuditEntry={(entry) => {
          try {
            const logs = JSON.parse(sessionStorage.getItem("threadcore_audit_logs") || "[]");
            logs.push(entry);
            sessionStorage.setItem("threadcore_audit_logs", JSON.stringify(logs));
          } catch {
            // ignore
          }
        }}
        onTriggerCheckout={() => {
          router.push("/studio");
        }}
      />
    </main>
  );
}

const REVIEWS = [
  {
    rating: 5,
    text: "The 220 GSM heavyweight tee is incredible. Boxy streetwear drape, thick collar that doesn't sag, and the custom DTG print had zero cracking after multiple washes.",
    author: "Aditya V.",
    location: "Bengaluru, KA",
    item: "Heavyweight Tee",
  },
  {
    rating: 5,
    text: "Tested automated ordering through the ACP JSON schema with my autonomous purchasing agent. Evaluated prices, applied bounds, and created a Razorpay order seamlessly.",
    author: "Dr. K. Sharma",
    location: "Hyderabad, TS",
    item: "Agent API User",
  },
  {
    rating: 5,
    text: "The fleece hoodie is easily worth double the price. Kangaroo pocket, double hood layer, and the custom print on charcoal fabric looks clean and futuristic.",
    author: "Rhea M.",
    location: "Mumbai, MH",
    item: "Technical Hoodie",
  },
];

const FAQS = [
  {
    q: "How does the custom studio printing work?",
    a: "Select any base garment (Tee, Hoodie, or Jersey), choose a curated preset stamp or upload your own high-resolution PNG/SVG file, select print locations (front, back, sleeves), and pick your printing technique. Our live SVG canvas gives you an instant realistic preview with front and back angles.",
  },
  {
    q: "What is your shipping and delivery timeline?",
    a: "All orders are processed and printed within 24 hours. We ship pan-India via express couriers. Delivery typically takes 2–4 business days depending on your city. Free express shipping is unlocked automatically on all orders above ₹999.",
  },
  {
    q: "What is your return & exchange policy?",
    a: "If your garment arrives with a defect, wrong size, or print imperfection, we offer a hassle-free 7-day replacement or refund. Just reach out to ops@threadcore.dev with your order receipt.",
  },
  {
    q: "How do Autonomous AI Agents purchase from ThreadCore?",
    a: "Autonomous AI agents can query the machine-readable catalog at GET /api/agent/catalog, validate bounded pricing via POST /api/agent/evaluate, and initiate Razorpay orders via POST /api/razorpay/create-order under a hard budget ceiling of ₹5,000.",
  },
  {
    q: "How should I wash and care for the printed apparel?",
    a: "Machine wash cold inside-out with like colors. Avoid bleach and fabric softeners. Tumble dry on low heat or hang dry for maximum print vibrancy. Do not iron directly on the printed surface.",
  },
];
