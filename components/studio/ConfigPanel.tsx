"use client";

import { useState, useCallback } from "react";
import type { StudioConfig, PricingBreakdown } from "@/lib/types";
import {
  APPAREL_SKUS,
  APPAREL_COLORS,
  PRINT_LOCATIONS,
  PRINT_TECHNIQUES,
} from "@/lib/catalog-data";
import { PRESET_DESIGNS } from "@/lib/preset-designs";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import Button from "@/components/ui/Button";

interface ConfigPanelProps {
  config: StudioConfig;
  onUpdate: (updates: Partial<StudioConfig>) => void;
  pricing?: PricingBreakdown;
  onInitiateCheckout?: () => void;
  onAddToBag?: () => void;
  justAddedToBag?: boolean;
}

export default function ConfigPanel({
  config,
  onUpdate,
  pricing,
  onInitiateCheckout,
  onAddToBag,
  justAddedToBag = false,
}: ConfigPanelProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [designTab, setDesignTab] = useState<"preset" | "upload">("preset");
  const selectedSKU = APPAREL_SKUS.find((s) => s.id === config.selectedSKU) || APPAREL_SKUS[1];
  const selectedColor = APPAREL_COLORS.find((c) => c.id === config.selectedColor) || APPAREL_COLORS[0];

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        onUpdate({
          designFile: file,
          designPreview: url,
          designDimensions: { widthPx: img.width, heightPx: img.height },
        });
      };
      img.src = url;
    },
    [onUpdate]
  );

  const selectPreset = (preset: typeof PRESET_DESIGNS[0]) => {
    onUpdate({
      designFile: null,
      designPreview: preset.dataUrl,
      designDimensions: { widthPx: 2000, heightPx: 2000 },
    });
  };

  const removeDesign = () => {
    onUpdate({
      designFile: null,
      designPreview: null,
      designDimensions: null,
    });
  };

  const togglePrintLocation = useCallback(
    (locationId: string) => {
      const current = config.printLocations;
      const next = current.includes(locationId)
        ? current.filter((id) => id !== locationId)
        : [...current, locationId];
      onUpdate({ printLocations: next.length > 0 ? next : ["front-center"] });
    },
    [config.printLocations, onUpdate]
  );

  // Calculate discount percentage
  const mrp = selectedSKU.originalPricePaise || Math.round(selectedSKU.basePricePaise * 1.35);
  const discountPercent = Math.round(((mrp - selectedSKU.basePricePaise) / mrp) * 100);

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto bg-surface-1 divide-y divide-border-subtle text-foreground text-sm">
        
        {/* ─── E-COMMERCE PRODUCT HEADER & RATINGS ─── */}
        <div className="p-5 flex flex-col gap-2">
          {/* Brand & Badge Bar */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-500">
              THREAD//CORE Original
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-amber-500/10 text-amber-500 border border-amber-500/30">
              {selectedSKU.badge || "Best Seller"}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {selectedSKU.name} — {selectedSKU.material}
          </h1>

          {/* Ratings & Verified Reviews */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[11px]">
              <span>★</span>
              <span>{selectedSKU.rating || 4.9}</span>
            </div>
            <span className="text-text-muted">
              {selectedSKU.reviewCount || 128} Ratings &amp; Verified Reviews
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-emerald-400 font-medium">In Stock</span>
          </div>

          {/* Price Block (Flipkart / Amazon Style) */}
          <div className="mt-2 p-3 rounded-sm bg-surface-2/60 border border-border-subtle flex flex-col gap-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-foreground tracking-tight">
                ₹{pricing ? (pricing.totalPaise / 100 / (config.quantity || 1)).toLocaleString("en-IN") : (selectedSKU.basePricePaise / 100).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-text-muted line-through">
                ₹{(mrp / 100).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-amber-400">
                {discountPercent}% OFF
              </span>
            </div>
            <span className="text-[11px] text-text-muted">
              Inclusive of all taxes (GST 18% calculated) • Free shipping on prepaid orders
            </span>
          </div>

          {/* Amazon/Flipkart Offers Strip */}
          <div className="mt-1 p-2.5 rounded-sm bg-amber-500/5 border border-amber-500/20 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <span>🏷️</span>
              <span>Special Offers &amp; Benefits</span>
            </div>
            <ul className="text-[11px] text-zinc-300 space-y-0.5 list-disc list-inside">
              <li>Instant 10% UPI Cashback with test payment rail.</li>
              <li>Free Express Delivery in 24 Hours.</li>
              <li>Autonomous Agent NPCI UAP Protocol Bounded.</li>
            </ul>
          </div>
        </div>

        {/* ─── 1. GARMENT SILHOUETTE / TYPE SELECTOR ("TYRE") ─── */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
              1. Select Apparel Silhouette:
            </span>
            <span className="text-xs font-bold text-amber-400">
              {selectedSKU.name} ({selectedSKU.weightGsm} GSM)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {APPAREL_SKUS.map((sku) => {
              const isSelected = config.selectedSKU === sku.id;
              return (
                <button
                  key={sku.id}
                  onClick={() =>
                    onUpdate({
                      selectedSKU: sku.id,
                      printLocations: ["front-center"],
                    })
                  }
                  className={`
                    p-2.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between gap-1
                    ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 text-foreground ring-1 ring-amber-500/40 font-semibold"
                        : "border-border-subtle bg-surface-2 hover:border-border text-text-secondary hover:text-foreground"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{sku.name}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">{sku.weightGsm} GSM • {sku.type}</span>
                  <span className="text-xs font-bold text-foreground mt-1">
                    ₹{(sku.basePricePaise / 100).toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 2. COLOR SELECTOR ─── */}
        <div className="p-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
              2. Color: <strong className="text-foreground">{selectedColor.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {APPAREL_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => onUpdate({ selectedColor: c.id })}
                title={c.name}
                className={`
                  w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center
                  ${
                    config.selectedColor === c.id
                      ? "border-amber-500 scale-110 ring-2 ring-amber-500/30"
                      : "border-border hover:border-zinc-400"
                  }
                `}
                style={{ backgroundColor: c.hex }}
              >
                {config.selectedColor === c.id && (
                  <span className={`text-xs ${c.id === "white" ? "text-black" : "text-white"}`}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ─── 3. SIZE SELECTOR ─── */}
        <div className="p-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
              3. Size: <strong className="text-foreground">{config.selectedSize}</strong>
            </span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 cursor-pointer"
            >
              Size Chart ↗
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedSKU.availableSizes.map((size) => {
              const isSelected = config.selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => onUpdate({ selectedSize: size })}
                  className={`
                    w-12 h-10 rounded-sm border font-bold text-xs uppercase transition-all cursor-pointer flex items-center justify-center
                    ${
                      isSelected
                        ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                        : "border-border-subtle bg-surface-2 text-text-secondary hover:border-border hover:text-foreground"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 4. CUSTOM ARTWORK STUDIO ─── */}
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
              4. Custom Graphic / Print Artwork:
            </span>
            {config.designPreview && (
              <button
                onClick={removeDesign}
                className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Remove Graphic
              </button>
            )}
          </div>

          {/* Sub-tabs: Curated Stamps vs Upload File */}
          <div className="flex rounded-sm border border-border-subtle bg-surface-2 p-1">
            <button
              onClick={() => setDesignTab("preset")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                designTab === "preset"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              Curated Stamps
            </button>
            <button
              onClick={() => setDesignTab("upload")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                designTab === "upload"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              Upload Custom File
            </button>
          </div>

          {designTab === "preset" ? (
            <div className="grid grid-cols-3 gap-2">
              {PRESET_DESIGNS.map((preset) => {
                const isSelected = config.designPreview === preset.dataUrl;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className={`p-2 rounded-sm border bg-surface-2 hover:bg-surface-3 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "border-amber-500 ring-1 ring-amber-500 bg-amber-500/10"
                        : "border-border-subtle hover:border-border"
                    }`}
                  >
                    <div className="w-12 h-12 bg-surface-1 border border-border-subtle rounded-xs flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset.dataUrl}
                        alt={preset.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-text-secondary truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-border-subtle hover:border-amber-500/50 rounded-sm p-4 text-center transition-all bg-surface-2/40 hover:bg-surface-2">
                {config.designPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 border border-border rounded-xs overflow-hidden bg-surface-1 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.designPreview}
                        alt="Design preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      ✓ Graphic Ready • {config.designDimensions?.widthPx}×{config.designDimensions?.heightPx}px
                    </span>
                    <span className="text-[10px] text-text-muted border border-border-subtle px-2 py-0.5 rounded">
                      Click to Replace File
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-lg">📁</span>
                    <span className="text-xs font-semibold text-foreground">
                      Click to upload high-res PNG or SVG
                    </span>
                    <span className="text-[10px] text-text-muted">
                      Recommended: 300+ DPI for photographic clarity
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/png,image/svg+xml"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>
          )}
        </div>

        {/* ─── 5. PRINT PLACEMENT & TECHNIQUE ─── */}
        <div className="p-5 flex flex-col gap-3">
          <span className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
            5. Print Placement:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {PRINT_LOCATIONS.filter(
              (loc) => selectedSKU && loc.compatibleSKUs.includes(selectedSKU.id)
            ).map((loc) => {
              const isChecked = config.printLocations.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  onClick={() => togglePrintLocation(loc.id)}
                  className={`
                    p-2.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between
                    ${
                      isChecked
                        ? "border-amber-500 bg-amber-500/10 text-foreground font-semibold"
                        : "border-border-subtle bg-surface-2 text-text-secondary hover:border-border"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                        isChecked ? "bg-amber-500 border-amber-500 text-white" : "border-border"
                      }`}
                    >
                      {isChecked && <span className="text-[9px] font-bold">✓</span>}
                    </div>
                    <span className="text-xs">{loc.name}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">
                    {loc.surchargePaise > 0 ? `+₹${loc.surchargePaise / 100}` : "Included"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-text-secondary">
              Print Method:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRINT_TECHNIQUES.map((tech) => {
                const isSelected = config.printTechnique === tech.id;
                return (
                  <button
                    key={tech.id}
                    onClick={() => onUpdate({ printTechnique: tech.id })}
                    className={`
                      p-2 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center justify-center
                      ${
                        isSelected
                          ? "border-amber-500 bg-amber-500 text-white font-bold"
                          : "border-border-subtle bg-surface-2 text-text-secondary hover:border-border"
                      }
                    `}
                  >
                    <span className="text-xs truncate">{tech.name.split(" ")[0]}</span>
                    <span className={`text-[9px] ${isSelected ? "text-amber-100" : "text-text-muted"}`}>
                      +{tech.areaMarkupPercent}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── 6. QUANTITY & IN-PANEL BUY BOX ACTIONS ─── */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
              6. Quantity:
            </span>
            <div className="flex items-center border border-border-subtle rounded-sm bg-surface-2">
              <button
                onClick={() => onUpdate({ quantity: Math.max(1, config.quantity - 1) })}
                className="w-8 h-8 flex items-center justify-center text-sm font-bold text-text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                −
              </button>
              <span className="w-8 text-center font-bold text-foreground text-sm">
                {config.quantity}
              </span>
              <button
                onClick={() => onUpdate({ quantity: Math.min(50, config.quantity + 1) })}
                className="w-8 h-8 flex items-center justify-center text-sm font-bold text-text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Flipkart / Amazon Action Buttons in Buy Box */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            {onAddToBag && (
              <Button
                onClick={onAddToBag}
                variant="cart"
                size="md"
                className="flex-1 font-bold shadow-sm"
              >
                {justAddedToBag ? "✓ Added to Bag" : "Add to Cart"}
              </Button>
            )}

            {onInitiateCheckout && (
              <Button
                onClick={onInitiateCheckout}
                variant="buy"
                size="md"
                className="flex-1 font-bold shadow-md"
              >
                ⚡ Buy Now →
              </Button>
            )}
          </div>

          {/* Delivery & Trust Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle text-center text-[10px] text-text-muted">
            <div className="flex flex-col items-center gap-1">
              <span>🚚</span>
              <span>24h Dispatch</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>🛡️</span>
              <span>NPCI Bounded</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>⚡</span>
              <span>Razorpay Verified</span>
            </div>
          </div>
        </div>

      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultType={selectedSKU?.type || "tee"}
      />
    </>
  );
}
