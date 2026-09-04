"use client";

import { useState } from "react";
import GarmentSVG from "./GarmentSVG";
import { APPAREL_SKUS, APPAREL_COLORS, getSKUImage } from "@/lib/catalog-data";

interface GarmentPreviewProps {
  type: "jersey" | "tee" | "hoodie";
  color: string;
  colorId?: string;
  skuId?: string;
  imageUrl?: string;
  designUrl?: string | null;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  view?: "front" | "back";
  className?: string;
}

const sizeClasses = {
  sm: "w-40 h-48",
  md: "w-full max-w-sm aspect-[3/4]",
  lg: "w-full max-w-lg aspect-[3/4]",
};

export default function GarmentPreview({
  type,
  color,
  colorId,
  skuId,
  imageUrl: explicitImageUrl,
  designUrl,
  size = "md",
  interactive = true,
  view = "front",
  className = "",
}: GarmentPreviewProps) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Resolve matching SKU
  const matchedSku = skuId
    ? APPAREL_SKUS.find((s) => s.id === skuId)
    : APPAREL_SKUS.find((s) => s.type === type) || APPAREL_SKUS[1];

  // Resolve matching color ID if not explicitly given
  const resolvedColorId =
    colorId ||
    APPAREL_COLORS.find((c) => c.hex.toLowerCase() === color.toLowerCase() || c.id === color)?.id ||
    "black";

  // Determine photographic image URL
  const photoUrl =
    explicitImageUrl || (matchedSku ? getSKUImage(matchedSku, view, resolvedColorId) : "");

  // Determine whether light color for print blending
  const isLightGarment =
    resolvedColorId === "white" || color === "#f4f4f5" || color.toLowerCase() === "#ffffff";

  // Print zone positioning depending on garment type and view
  const printZoneStyle =
    view === "back"
      ? { top: "25%", left: "50%", width: "38%", height: "40%", transform: "translateX(-50%)" }
      : type === "hoodie"
      ? { top: "33%", left: "50%", width: "34%", height: "32%", transform: "translateX(-50%)" }
      : type === "jersey"
      ? { top: "30%", left: "50%", width: "36%", height: "38%", transform: "translateX(-50%)" }
      : { top: "28%", left: "50%", width: "36%", height: "38%", transform: "translateX(-50%)" };

  return (
    <div
      className={`
        relative flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        ${interactive ? "cursor-pointer" : ""}
        ${className}
        group
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Brutalist card border and subtle background gradient */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-b from-surface-2 to-surface-1
          border border-border-subtle
          transition-all duration-500
          ${hovered && interactive ? "border-border shadow-[0_0_30px_rgba(244,244,245,0.04)]" : ""}
        `}
      />

      {/* Subtle image loading skeleton */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-surface-2/60 animate-pulse flex items-center justify-center z-0">
          <div className="w-6 h-6 border-2 border-emerald-400/40 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Garment Visual Presentation */}
      <div
        className={`
          relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500
          ${hovered && interactive ? "scale-[1.03]" : "scale-100"}
        `}
      >
        {photoUrl && !imgError ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={`${matchedSku?.name || type} - ${resolvedColorId} ${view}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`
                w-full h-full object-cover select-none transition-opacity duration-300
                ${imgLoaded ? "opacity-100" : "opacity-0"}
              `}
            />

            {/* Custom Graphic Print Overlay (DTG / Sublimation simulation) */}
            {designUrl && (
              <div
                className="absolute pointer-events-none z-20 flex items-center justify-center overflow-hidden"
                style={printZoneStyle}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={designUrl}
                  alt="Custom Print Decal"
                  className="w-full h-full object-contain"
                  style={{
                    mixBlendMode: isLightGarment ? "multiply" : "screen",
                    opacity: 0.94,
                    filter: isLightGarment
                      ? "drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
                      : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          /* Graceful fallback to GarmentSVG */
          <GarmentSVG
            type={type}
            color={color}
            designUrl={designUrl}
            view={view}
            className="w-full h-full drop-shadow-lg"
          />
        )}
      </div>

      {/* Interactive Hover prompt */}
      {hovered && interactive && (
        <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
          <div className="bg-background/85 backdrop-blur-md border border-border-subtle px-3 py-1.5 text-center shadow-xl">
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-primary">
              Click to customize in Studio →
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
