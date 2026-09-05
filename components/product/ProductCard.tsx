"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApparelSKU, ApparelColor } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import QuickViewModal from "./QuickViewModal";

import { getSKUImage } from "@/lib/catalog-data";
import Button from "@/components/ui/Button";

interface ProductCardProps {
  sku: ApparelSKU;
  index: number;
}

export default function ProductCard({ sku, index }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<ApparelColor>(
    sku.availableColors[0] || { id: "black", name: "Black", hex: "#1a1a1a" }
  );
  const [activeAngle, setActiveAngle] = useState<"front" | "back">("front");
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = sku.originalPricePaise
    ? Math.round(((sku.originalPricePaise - sku.basePricePaise) / sku.originalPricePaise) * 100)
    : 0;

  // On desktop hover, show the back view automatically unless manually switched
  const effectiveView = isHovered ? (activeAngle === "front" ? "back" : "front") : activeAngle;

  const frontImg = getSKUImage(sku, "front", selectedColor.id);
  const backImg = getSKUImage(sku, "back", selectedColor.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      skuId: sku.id,
      name: sku.name,
      type: sku.type,
      color: selectedColor,
      size: sku.availableSizes[1] || sku.availableSizes[0] || "M",
      printLocations: ["front-center"],
      printTechnique: "dtg",
      quantity: 1,
      unitPricePaise: sku.basePricePaise,
      totalPaise: sku.basePricePaise,
      designPreview: null,
      designName: "Blank Core",
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group border border-border-subtle bg-surface-1 hover:border-border transition-all duration-300 flex flex-col justify-between relative product-card-hover"
      >
        {/* Top Badges & Angle Pill */}
        <div className="p-5 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            {sku.badge && (
              <span className="font-mono text-[8px] uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 font-bold">
                {sku.badge}
              </span>
            )}
          </div>

          {/* Quick Front/Back Angle Toggle Pill */}
          <div className="flex border border-border-subtle bg-surface-2 p-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveAngle("front")}
              className={`px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider transition-colors ${
                effectiveView === "front" ? "bg-foreground text-background font-bold" : "text-text-muted hover:text-foreground"
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setActiveAngle("back")}
              className={`px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider transition-colors ${
                effectiveView === "back" ? "bg-foreground text-background font-bold" : "text-text-muted hover:text-foreground"
              }`}
            >
              Back
            </button>
          </div>
        </div>

        {/* Product Visual Area with Real Apparel Photography and Angle Flip */}
        <div className="p-6 flex flex-col items-center justify-center relative min-h-[260px] overflow-hidden">
          <Link
            href={`/studio?sku=${sku.id}&color=${selectedColor.id}`}
            className="w-full flex justify-center cursor-pointer"
          >
            <div className="relative w-full max-w-[240px] aspect-[3/4] border border-border-subtle bg-surface-2/60 overflow-hidden shadow-lg group-hover:border-border transition-colors">
              {/* Front angle photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frontImg}
                alt={`${sku.name} - Front Angle (${selectedColor.name})`}
                loading="lazy"
                className={`absolute inset-0 w-full h-full ${frontImg.startsWith("/pictures/") ? "object-contain p-3 drop-shadow-md" : "object-cover"} transition-all duration-500 ease-out group-hover:scale-105 ${
                  effectiveView === "front" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              />

              {/* Back angle photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={backImg}
                alt={`${sku.name} - Back Angle (${selectedColor.name})`}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                  effectiveView === "back" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              />

              {/* Bottom Subtle Angle Pill inside image */}
              <div className="absolute bottom-2 left-2 z-20 bg-background/80 backdrop-blur-sm border border-border-subtle px-1.5 py-0.5 pointer-events-none">
                <span className="font-mono text-[7px] uppercase tracking-widest text-text-muted">
                  {effectiveView}
                </span>
              </div>
            </div>
          </Link>

          {/* Floating Quick View overlay button */}
          <button
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 glass-panel-interactive text-foreground px-4 py-1.5 font-mono text-[9px] uppercase tracking-widest hover:border-amber-500 hover:text-amber-400 shadow-2xl active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Quick View</span>
            <span className="text-amber-400">👁</span>
          </button>
        </div>

        {/* Color Swatches */}
        <div className="px-5 py-2.5 flex items-center justify-between border-t border-border-subtle/60 bg-surface-1/60">
          <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
            {selectedColor.name}
          </span>
          <div className="flex gap-1.5">
            {sku.availableColors.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c)}
                title={c.name}
                aria-label={`Select color ${c.name}`}
                className={`w-3.5 h-3.5 border transition-all cursor-pointer ${
                  selectedColor.id === c.id
                    ? "border-amber-400 scale-125 ring-2 ring-amber-500/30"
                    : "border-border-subtle hover:border-border hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="p-5 pt-3 border-t border-border-subtle bg-surface-1">
          {sku.rating && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-amber-400 text-xs">★</span>
              <span className="font-mono text-[10px] text-text-secondary font-medium">
                {sku.rating}
              </span>
              <span className="font-mono text-[9px] text-text-muted">
                ({sku.reviewCount})
              </span>
              <span className="text-text-muted">•</span>
              <span className="font-mono text-[8px] text-text-secondary font-bold">
                {sku.weightGsm || 220} GSM
              </span>
            </div>
          )}

          <h3 className="font-mono text-sm uppercase tracking-wider text-foreground mb-1 group-hover:text-amber-400 transition-colors font-bold">
            {sku.name}
          </h3>
          <p className="font-mono text-[10px] text-text-muted line-clamp-2 leading-relaxed mb-4">
            {sku.description}
          </p>

          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block">
                Starting at
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-foreground">
                  ₹{(sku.basePricePaise / 100).toFixed(0)}
                </span>
                {sku.originalPricePaise && (
                  <span className="font-mono text-xs text-text-muted line-through">
                    ₹{(sku.originalPricePaise / 100).toFixed(0)}
                  </span>
                )}
              </div>
            </div>

            {discountPercent > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 font-bold">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Action Row with Flipkart/Amazon Style Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              onClick={handleQuickAdd}
              variant={justAdded ? "buy" : "cart"}
              size="sm"
              className="w-full text-[10px] font-bold"
            >
              {justAdded ? "✓ In Cart!" : "+ Quick Add"}
            </Button>

            <Link
              href={`/studio?sku=${sku.id}&color=${selectedColor.id}`}
              className="w-full"
            >
              <Button
                variant="buy"
                size="sm"
                className="w-full text-[10px] font-bold shadow-sm"
              >
                Customize →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <QuickViewModal
        sku={sku}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        initialColor={selectedColor}
      />
    </>
  );
}
