"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ApparelSKU, ApparelColor } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { getSKUImage } from "@/lib/catalog-data";
import SizeGuideModal from "./SizeGuideModal";
import Button from "@/components/ui/Button";

interface QuickViewModalProps {
  sku: ApparelSKU | null;
  isOpen: boolean;
  onClose: () => void;
  initialColor?: ApparelColor;
}

export default function QuickViewModal({ sku, isOpen, onClose, initialColor }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [prevSkuId, setPrevSkuId] = useState<string | undefined>(sku?.id);
  const [selectedColor, setSelectedColor] = useState<ApparelColor | null>(() => initialColor || sku?.availableColors[0] || null);
  const [selectedSize, setSelectedSize] = useState<string>(() => sku?.availableSizes[1] || sku?.availableSizes[0] || "M");
  const [view, setView] = useState<"front" | "back" | "macro" | "model">("front");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (sku && sku.id !== prevSkuId) {
    setPrevSkuId(sku.id);
    setSelectedColor(initialColor || sku.availableColors[0] || null);
    setSelectedSize(sku.availableSizes[1] || sku.availableSizes[0] || "M");
    setView("front");
    setAddedAnimation(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !sku || !selectedColor) return null;

  const currentPhoto = getSKUImage(sku, view, selectedColor.id);

  const handleQuickAdd = () => {
    addItem({
      skuId: sku.id,
      name: sku.name,
      type: sku.type,
      color: selectedColor,
      size: selectedSize,
      printLocations: ["front-center"],
      printTechnique: "dtg",
      quantity: 1,
      unitPricePaise: sku.basePricePaise,
      totalPaise: sku.basePricePaise,
      designPreview: null,
      designName: "Blank Core",
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 400);
  };

  const discountPercent = sku.originalPricePaise
    ? Math.round(((sku.originalPricePaise - sku.basePricePaise) / sku.originalPricePaise) * 100)
    : 0;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fade-in-up"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-surface-1 border border-border text-foreground shadow-2xl relative max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border border-border-subtle hover:border-border hover:bg-surface-2 transition-colors font-mono text-sm text-text-secondary hover:text-foreground cursor-pointer"
          >
            ✕
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Real Garment Photographic Image & Angle Switcher */}
            <div className="p-6 md:p-8 bg-surface-2/40 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col items-center justify-center relative">
              {sku.badge && (
                <div className="absolute top-4 left-4 bg-surface-3 border border-border px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-emerald-400">
                  {sku.badge}
                </div>
              )}

              <div className="w-full max-w-[280px] aspect-[3/4] relative border border-border-subtle bg-surface-1 overflow-hidden shadow-xl my-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto}
                  alt={`${sku.name} - ${view}`}
                  className={`w-full h-full ${currentPhoto?.startsWith("/pictures/") ? "object-contain p-3 drop-shadow-md" : "object-cover"} select-none`}
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm border border-border-subtle px-1.5 py-0.5">
                  <span className="font-mono text-[7px] uppercase tracking-widest text-text-muted">
                    {view}
                  </span>
                </div>
              </div>

              {/* View Angle Pill Selectors */}
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                <button
                  onClick={() => setView("front")}
                  className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider border transition-colors cursor-pointer ${
                    view === "front"
                      ? "border-foreground bg-surface-3 text-foreground font-bold"
                      : "border-border-subtle text-text-muted hover:border-border"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setView("back")}
                  className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider border transition-colors cursor-pointer ${
                    view === "back"
                      ? "border-foreground bg-surface-3 text-foreground font-bold"
                      : "border-border-subtle text-text-muted hover:border-border"
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={() => setView("macro")}
                  className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider border transition-colors cursor-pointer ${
                    view === "macro"
                      ? "border-foreground bg-surface-3 text-foreground font-bold"
                      : "border-border-subtle text-text-muted hover:border-border"
                  }`}
                >
                  Macro
                </button>
                <button
                  onClick={() => setView("model")}
                  className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider border transition-colors cursor-pointer ${
                    view === "model"
                      ? "border-foreground bg-surface-3 text-foreground font-bold"
                      : "border-border-subtle text-text-muted hover:border-border"
                  }`}
                >
                  Fit
                </button>
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                    {sku.id}
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400">
                    In Stock • Ready to ship
                  </span>
                </div>

                <h2 id="quick-view-title" className="font-mono text-xl uppercase tracking-wider text-foreground mb-2">
                  {sku.name}
                </h2>

                {/* Rating */}
                {sku.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-400 text-xs">
                      {"★".repeat(Math.floor(sku.rating))}
                    </div>
                    <span className="font-mono text-[10px] text-text-secondary">
                      {sku.rating} ({sku.reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-2xl text-foreground font-bold">
                    ₹{(sku.basePricePaise / 100).toFixed(0)}
                  </span>
                  {sku.originalPricePaise && (
                    <>
                      <span className="font-mono text-sm text-text-muted line-through">
                        ₹{(sku.originalPricePaise / 100).toFixed(0)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="font-mono text-[11px] text-text-secondary leading-relaxed mb-6">
                  {sku.description}
                </p>

                {/* Color Selector */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                      Color: <span className="text-foreground">{selectedColor.name}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {sku.availableColors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-6 h-6 border transition-all ${
                          selectedColor.id === c.id
                            ? "border-foreground scale-110 ring-2 ring-foreground/20"
                            : "border-border-subtle hover:border-border"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                      Select Size:
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="font-mono text-[9px] uppercase tracking-widest text-text-secondary hover:text-foreground underline underline-offset-2"
                    >
                      Size Guide ↗
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sku.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all ${
                          selectedSize === size
                            ? "border-foreground bg-surface-3 text-foreground font-bold"
                            : "border-border-subtle text-text-secondary hover:border-border"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs pill */}
                <div className="border border-border-subtle bg-surface-2/40 p-3 mb-6 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Fabric / Material:</span>
                    <span className="text-foreground">{sku.material || "100% Combed Cotton"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Weight / Density:</span>
                    <span className="text-foreground">{sku.weightGsm || 220} GSM</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <Button
                  onClick={handleQuickAdd}
                  variant={addedAnimation ? "glow" : "shimmer"}
                  size="lg"
                  className="w-full font-bold"
                >
                  {addedAnimation ? "✓ Added to Bag!" : "Quick Add to Bag"}
                </Button>

                <Link
                  href={`/studio?sku=${sku.id}&color=${selectedColor.id}&size=${selectedSize}`}
                  onClick={onClose}
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full font-bold"
                  >
                    Open Custom Print Studio →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultType={sku.type}
      />
    </>
  );
}
