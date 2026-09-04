"use client";

import { useState } from "react";
import Link from "next/link";
import { EDITORIAL_LOOKBOOK_IMAGES } from "@/lib/catalog-data";
import { PRESET_DESIGNS } from "@/lib/preset-designs";

export default function EditorialBentoGallery() {
  const [activePin, setActivePin] = useState<boolean>(true);
  const [blankVsPrint, setBlankVsPrint] = useState<"blank" | "printed">("printed");

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border-subtle">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 mb-2 font-bold">
            Editorial Lookbook • Season 2026
          </div>
          <h2 className="font-mono text-2xl lg:text-3xl uppercase tracking-wider text-foreground font-bold">
            Streetwear Craft & Construction
          </h2>
        </div>
        <p className="font-mono text-xs text-text-secondary max-w-md leading-relaxed">
          Inspect our heavyweight silhouettes, reinforced collar ribbing, and high-density print fidelity through our multi-angle bento showcase.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px]">
        {/* ─── CELL 1: HERO EDITORIAL LOOK (2 cols, 2 rows) ─── */}
        <div className="md:col-span-2 md:row-span-2 border border-border-subtle bg-gradient-to-b from-surface-2 to-surface-1 p-6 md:p-10 relative overflow-hidden group flex flex-col justify-between shadow-2xl">
          <div className="absolute inset-0 dot-grid opacity-15" />
          <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Top meta */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1">
              Editorial Drop 01
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
              Fit: Boxy Drop-Shoulder
            </span>
          </div>

          {/* Main Visual with Real Editorial Photography and interactive Hotspot */}
          <div className="relative z-10 my-auto flex items-center justify-center py-4">
            <div className="w-full max-w-xs relative aspect-[3/4] border border-border-subtle overflow-hidden shadow-2xl bg-surface-2/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EDITORIAL_LOOKBOOK_IMAGES.heroTee}
                alt="Editorial Heavyweight Tee Lookbook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                loading="lazy"
              />

              {/* Interactive Hotspot Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={() => setActivePin(!activePin)}
                  aria-label="Toggle garment detail hotspot"
                  className="relative flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-background font-bold text-xs shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  +
                </button>

                {/* Hotspot Popover Tooltip */}
                {activePin && (
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-52 bg-background/95 backdrop-blur-md border border-border p-3 shadow-2xl animate-fade-in-up z-30">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-foreground font-bold">
                        Heavyweight Tee
                      </span>
                      <span className="font-mono text-[9px] text-emerald-400 font-bold">
                        ₹599
                      </span>
                    </div>
                    <p className="font-mono text-[8px] text-text-muted mb-2">
                      220 GSM ring-spun cotton with custom &quot;Glitch Disruption&quot; DTG print.
                    </p>
                    <Link
                      href="/studio?sku=TC-TEE-001&preset=glitch-disruption"
                      className="block text-center py-1 bg-foreground text-background font-mono text-[8px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-colors"
                    >
                      Customize This Look →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="relative z-10 flex items-end justify-between pt-4 border-t border-border-subtle/60">
            <div>
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block">
                Garment Density
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                220 GSM Combed Compact Cotton
              </span>
            </div>
            <Link
              href="/studio?sku=TC-TEE-001"
              className="font-mono text-[10px] uppercase tracking-widest text-foreground hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              Configure Silhouette →
            </Link>
          </div>
        </div>

        {/* ─── CELL 2: FABRIC WEAVE & COLLAR DETAIL (1 col, 1 row) ─── */}
        <div className="border border-border-subtle bg-surface-1 p-6 flex flex-col justify-between hover:border-border transition-colors group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
              Macro Construction
            </span>
            <span className="font-mono text-[8px] text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5">
              1.25&quot; Collar
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center py-2">
            <div className="w-20 h-20 rounded-full border border-border-subtle overflow-hidden mb-2 group-hover:scale-110 transition-transform shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EDITORIAL_LOOKBOOK_IMAGES.collarMacro}
                alt="Macro Cotton Weave"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold mb-1">
              Twin-Needle Ribbing
            </h4>
            <p className="font-mono text-[9px] text-text-muted leading-relaxed line-clamp-2">
              Elastane-infused dense collar prevents deformation and baconing across 50+ wash tests.
            </p>
          </div>

          <div className="font-mono text-[8px] text-text-muted uppercase tracking-wider border-t border-border-subtle/60 pt-2 flex justify-between">
            <span>Shrinkage: &lt;2%</span>
            <span>Organic Bio-Wash</span>
          </div>
        </div>

        {/* ─── CELL 3: DTG HIGH-DENSITY PRINT QUALITY (1 col, 1 row) ─── */}
        <div className="border border-border-subtle bg-surface-1 p-6 flex flex-col justify-between hover:border-border transition-colors group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
              Ink Deposition
            </span>
            <span className="font-mono text-[8px] text-amber-400 border border-amber-500/20 px-1.5 py-0.5">
              300+ DPI
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center py-2">
            <div className="w-20 h-20 rounded-full border border-border-subtle overflow-hidden mb-2 group-hover:scale-110 transition-transform shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EDITORIAL_LOOKBOOK_IMAGES.printDetail}
                alt="DTG High-Density Print Quality"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold mb-1">
              Direct to Garment (DTG)
            </h4>
            <p className="font-mono text-[9px] text-text-muted leading-relaxed line-clamp-2">
              Water-based pigment inks embedded deep into cotton fibers for soft-hand, breathable prints.
            </p>
          </div>

          <div className="font-mono text-[8px] text-text-muted uppercase tracking-wider border-t border-border-subtle/60 pt-2 flex justify-between">
            <span>OEKO-TEX Certified</span>
            <span>Zero Plastic Feel</span>
          </div>
        </div>

        {/* ─── CELL 4: INTERACTIVE RAW BLANK VS PRINTED COMPARISON (2 cols, 1 row) ─── */}
        <div className="md:col-span-2 border border-border-subtle bg-surface-1 p-6 flex flex-col justify-between hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block">
                Interactive Comparison
              </span>
              <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                Raw Streetwear Blank vs. Custom Graphic
              </h4>
            </div>

            {/* Toggle pill */}
            <div className="flex border border-border-subtle bg-surface-2 p-0.5">
              <button
                onClick={() => setBlankVsPrint("blank")}
                className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider transition-colors cursor-pointer ${
                  blankVsPrint === "blank"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                Raw Blank
              </button>
              <button
                onClick={() => setBlankVsPrint("printed")}
                className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider transition-colors cursor-pointer ${
                  blankVsPrint === "printed"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                Printed Core
              </button>
            </div>
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="w-28 h-36 relative border border-border-subtle bg-surface-2/60 overflow-hidden shadow-lg flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EDITORIAL_LOOKBOOK_IMAGES.hoodieBlank}
                alt="Technical Hoodie Blank"
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {blankVsPrint === "printed" && (
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[44%] h-[36%] pointer-events-none z-10 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PRESET_DESIGNS[0].dataUrl}
                    alt="Cyber Matrix Print"
                    className="w-full h-full object-contain"
                    style={{
                      mixBlendMode: "screen",
                      opacity: 0.94,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="max-w-xs font-mono text-[10px] text-text-secondary leading-relaxed space-y-1 ml-4">
              <p>
                <strong className="text-foreground">
                  {blankVsPrint === "blank" ? "Blank Core Canvas:" : "Custom Ink Integration:"}
                </strong>{" "}
                {blankVsPrint === "blank"
                  ? "Unprinted 320 GSM French Terry fleece hoodie with double-layer crossover hood and kangaroo pocket."
                  : "Precision DTG printed with 'Cyber Matrix' vector graphic across 300x420mm chest bounds."}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/studio?sku=TC-HOD-001"
                  className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 hover:underline underline-offset-2 font-bold"
                >
                  Launch Studio with this Hoodie →
                </Link>
              </div>
            </div>
          </div>

          <div className="font-mono text-[8px] text-text-muted uppercase tracking-widest border-t border-border-subtle/60 pt-2 flex justify-between">
            <span>SKU: TC-HOD-001</span>
            <span>French Terry Fleece • ₹1,299</span>
          </div>
        </div>
      </div>
    </section>
  );
}
