"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MagnifierLens from "./MagnifierLens";
import type { ApparelSKU, ApparelColor } from "@/lib/types";
import { getSKUImage } from "@/lib/catalog-data";

const Garment3DCanvas = dynamic(() => import("./Garment3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] bg-surface-1 border border-border-subtle flex flex-col items-center justify-center font-mono text-[10px] uppercase text-text-muted gap-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      <span>Loading 3D WebGL Canvas...</span>
    </div>
  ),
});

interface PictureGalleryProps {
  sku: ApparelSKU;
  color: ApparelColor;
  designUrl?: string | null;
  className?: string;
  activeAngleIndex?: number;
  onAngleChange?: (angle: "front" | "back" | "macro" | "model" | "3d") => void;
}

export default function PictureGallery({
  sku,
  color,
  designUrl,
  className = "",
  activeAngleIndex: externalAngleIndex,
  onAngleChange,
}: PictureGalleryProps) {
  const [internalAngleIndex, setInternalAngleIndex] = useState(0);
  const activeIndex = externalAngleIndex !== undefined ? externalAngleIndex : internalAngleIndex;

  const angles = [
    ...(sku.angles || [
      { id: "front" as const, label: "Front Angle", tag: "Frontal Silhouette", description: "Straight-on view showing neckline ribbing and front custom print canvas." },
      { id: "back" as const, label: "Back Angle", tag: "Rear Yoke", description: "Clean back silhouette showing seamless shoulder line and back print canvas." },
      { id: "macro" as const, label: "Macro Weave", tag: "Fabric Detail (2.5x)", description: "Extreme close-up inspecting knit yarn density and high-tension flatlock seams." },
      { id: "model" as const, label: "Model Fit", tag: "On-Body Proportion", description: "Streetwear lookbook styling showing true shoulder drop and drape." },
    ]),
    { id: "3d" as const, label: "3D Turntable", tag: "Three.js 360°", description: "Full 3D rotating canvas with OrbitControls and realistic decal texture projection." },
  ];

  const currentAngle = angles[activeIndex] || angles[0];

  const frontImg = getSKUImage(sku, "front", color.id);
  const backImg = getSKUImage(sku, "back", color.id);
  const macroImg = getSKUImage(sku, "macro", color.id);
  const modelImg = getSKUImage(sku, "model", color.id);

  const isLightColor = color.id === "white" || color.hex.toLowerCase() === "#f4f4f5";

  const handleSelectAngle = (idx: number) => {
    setInternalAngleIndex(idx);
    if (onAngleChange && angles[idx]) {
      onAngleChange(angles[idx].id);
    }
  };

  const handleNext = () => {
    const nextIdx = activeIndex === angles.length - 1 ? 0 : activeIndex + 1;
    handleSelectAngle(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = activeIndex === 0 ? angles.length - 1 : activeIndex - 1;
    handleSelectAngle(prevIdx);
  };

  return (
    <div className={`flex flex-col-reverse md:flex-row gap-4 ${className}`}>
      {/* ─── THUMBNAIL RAIL (Vertical Desktop / Horizontal Mobile) ─── */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto pb-1 md:pb-0 shrink-0 select-none">
        {angles.map((angle, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={angle.id}
              onClick={() => handleSelectAngle(idx)}
              aria-label={`View ${angle.label}`}
              className={`
                relative w-16 h-20 md:w-20 md:h-24 p-1 border bg-surface-1 flex flex-col items-center justify-between
                transition-all duration-200 shrink-0 text-left group overflow-hidden cursor-pointer
                ${
                  isSelected
                    ? "border-foreground ring-1 ring-foreground bg-surface-2"
                    : "border-border-subtle opacity-75 hover:opacity-100 hover:border-border"
                }
              `}
            >
              {/* Miniature Thumbnail Representation */}
              <div className="w-full flex-1 relative overflow-hidden bg-surface-2/50 flex items-center justify-center">
                {angle.id === "front" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={frontImg}
                    alt="Front thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {angle.id === "back" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={backImg}
                    alt="Back thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {angle.id === "macro" && (
                  <div className="w-full h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={macroImg}
                      alt="Macro thumbnail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="font-mono text-[8px] text-emerald-400 font-bold bg-background/80 px-1 py-0.5 border border-emerald-500/30">
                        2.5x
                      </span>
                    </div>
                  </div>
                )}
                {angle.id === "model" && (
                  <div className="w-full h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={modelImg}
                      alt="Model fit thumbnail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="font-mono text-[7px] text-foreground font-bold bg-background/80 px-1 py-0.5 border border-border-subtle">
                        FIT
                      </span>
                    </div>
                  </div>
                )}
                {angle.id === "3d" && (
                  <div className="w-full h-full border border-emerald-500/40 bg-emerald-950/30 flex flex-col items-center justify-center p-1">
                    <span className="font-mono text-sm font-bold text-emerald-400">3D</span>
                    <span className="font-mono text-[7px] text-emerald-400 uppercase">360°</span>
                  </div>
                )}
              </div>

              {/* Tag under thumbnail */}
              <span className="font-mono text-[7px] uppercase tracking-wider text-text-secondary truncate w-full text-center mt-1">
                {angle.id}
              </span>

              {isSelected && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── MAIN PICTURE DISPLAY WITH MAGNIFIER LENS ─── */}
      <div className="flex-1 flex flex-col">
        <div className="group relative w-full aspect-[3/4] bg-gradient-to-b from-surface-2 to-surface-1 border border-border-subtle overflow-hidden shadow-2xl">
          {/* Top Picture Status Bar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 bg-background/85 backdrop-blur-md border border-border-subtle px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-primary font-bold">
                {currentAngle.tag}
              </span>
            </div>

            <div className="bg-background/85 backdrop-blur-md border border-border-subtle px-2 py-0.5">
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                {activeIndex + 1} / {angles.length}
              </span>
            </div>
          </div>

          {/* Navigation Chevrons */}
          <button
            onClick={handlePrev}
            aria-label="Previous angle"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border-subtle text-foreground hover:bg-foreground hover:text-background transition-all font-mono text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          >
            ⟨
          </button>
          <button
            onClick={handleNext}
            aria-label="Next angle"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border-subtle text-foreground hover:bg-foreground hover:text-background transition-all font-mono text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          >
            ⟩
          </button>

          {/* Main Visual Display (3D Canvas or 2D Magnifier) */}
          {currentAngle.id === "3d" ? (
            <Garment3DCanvas
              skuId={sku.id}
              garmentType={sku.type}
              colorHex={color.hex}
              designUrl={designUrl}
              className="w-full h-full"
            />
          ) : (
            <MagnifierLens zoomLevel={2.2} lensSize={180} className="w-full h-full flex items-center justify-center">
              {/* Front and Back Real Photography with Custom Decal Overlay */}
              {(currentAngle.id === "front" || currentAngle.id === "back") && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentAngle.id === "front" ? frontImg : backImg}
                    alt={`${sku.name} - ${currentAngle.label} (${color.name})`}
                    className="w-full h-full object-cover select-none"
                  />

                  {/* Custom Graphic Print Overlay */}
                  {designUrl && (
                    <div
                      className="absolute pointer-events-none z-20 flex items-center justify-center overflow-hidden"
                      style={
                        currentAngle.id === "back"
                          ? { top: "25%", left: "50%", width: "38%", height: "40%", transform: "translateX(-50%)" }
                          : sku.type === "hoodie"
                          ? { top: "33%", left: "50%", width: "34%", height: "32%", transform: "translateX(-50%)" }
                          : sku.type === "jersey"
                          ? { top: "30%", left: "50%", width: "36%", height: "38%", transform: "translateX(-50%)" }
                          : { top: "28%", left: "50%", width: "36%", height: "38%", transform: "translateX(-50%)" }
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={designUrl}
                        alt="Custom Print Decal"
                        className="w-full h-full object-contain"
                        style={{
                          mixBlendMode: isLightColor ? "multiply" : "screen",
                          opacity: 0.94,
                          filter: isLightColor
                            ? "drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
                            : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Macro Fabric Weave Close-up */}
              {currentAngle.id === "macro" && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={macroImg}
                    alt={`${sku.name} - Macro Fabric Texture`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40 pointer-events-none" />

                  {/* Top HUD badge */}
                  <div className="absolute top-12 left-4 z-10 bg-background/90 backdrop-blur-md border border-border-subtle p-3 pointer-events-none max-w-xs shadow-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 font-bold">
                        Macro Weave 2.5x Inspection
                      </span>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold block mb-0.5">
                      {sku.material || "100% Combed Cotton"}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                      {sku.weightGsm || 220} GSM Ultra-Dense Weave
                    </span>
                  </div>

                  {/* Bottom Technical Specs Ribbon */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 bg-background/90 backdrop-blur-md border border-border-subtle p-3 pointer-events-none flex flex-wrap justify-between items-center gap-2 font-mono text-[8px] text-text-muted">
                    <span className="text-foreground font-semibold">
                      Twin-Needle Seams: <span className="text-emerald-400">✓ Certified</span>
                    </span>
                    <span>Pre-Shrunk: &lt;2%</span>
                    <span>Reactive Dye: Grade 4+</span>
                    <span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-950/40 px-1.5 py-0.5">
                      300+ DPI Base
                    </span>
                  </div>
                </div>
              )}

              {/* On-Body Model Fit Lookbook */}
              {currentAngle.id === "model" && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={modelImg}
                    alt={`${sku.name} - Streetwear On-Body Fit`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30 pointer-events-none" />

                  {/* Bottom Model Proportions HUD */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 bg-background/90 backdrop-blur-md border border-border-subtle p-3 pointer-events-none shadow-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                        Streetwear Lookbook Fit
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                        Boxy Drop-Shoulder
                      </span>
                    </div>
                    <p className="font-mono text-xs text-foreground font-semibold mb-1">
                      {sku.modelFitInfo || "Model is 185cm / 75kg wearing size L"}
                    </p>
                    <p className="font-mono text-[9px] text-text-muted leading-relaxed">
                      Features intentional shoulder drop, tailored bicep circumference, and premium drape without boxy stiffness.
                    </p>
                  </div>
                </div>
              )}
            </MagnifierLens>
          )}

          {/* Bottom Desktop Zoom Hint */}
          <div className="absolute bottom-3 right-3 hidden md:flex items-center gap-1.5 bg-background/80 backdrop-blur-sm border border-border-subtle px-2 py-1 pointer-events-none">
            <span className="font-mono text-[7px] uppercase tracking-widest text-text-muted">
              Hover cursor for 2.2x macro loupe 🔍
            </span>
          </div>
        </div>

        {/* Angle Description Banner */}
        <div className="mt-3 p-3 bg-surface-2/40 border border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-foreground font-semibold">
              {currentAngle.label}:
            </span>
            <span className="font-mono text-[9px] text-text-muted hidden sm:inline">
              {currentAngle.description}
            </span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 border border-emerald-500/20 px-2 py-0.5">
            {color.name}
          </span>
        </div>
      </div>
    </div>
  );
}
