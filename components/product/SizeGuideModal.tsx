"use client";

import { useEffect, useState } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "tee" | "jersey" | "hoodie";
}

interface MeasurementRow {
  size: string;
  chestCm: number;
  chestIn: number;
  lengthCm: number;
  lengthIn: number;
  shoulderCm: number;
  shoulderIn: number;
}

const SIZE_CHARTS: Record<string, { name: string; fit: string; rows: MeasurementRow[] }> = {
  tee: {
    name: "Heavyweight Boxy Tee",
    fit: "Boxy / Drop-Shoulder Oversized Fit. If you prefer a tailored fit, we recommend sizing down.",
    rows: [
      { size: "XS", chestCm: 98, chestIn: 38.5, lengthCm: 68, lengthIn: 26.8, shoulderCm: 48, shoulderIn: 18.9 },
      { size: "S", chestCm: 104, chestIn: 41.0, lengthCm: 71, lengthIn: 28.0, shoulderCm: 50, shoulderIn: 19.7 },
      { size: "M", chestCm: 110, chestIn: 43.3, lengthCm: 74, lengthIn: 29.1, shoulderCm: 52, shoulderIn: 20.5 },
      { size: "L", chestCm: 116, chestIn: 45.7, lengthCm: 76, lengthIn: 30.0, shoulderCm: 54, shoulderIn: 21.3 },
      { size: "XL", chestCm: 122, chestIn: 48.0, lengthCm: 78, lengthIn: 30.7, shoulderCm: 56, shoulderIn: 22.0 },
      { size: "XXL", chestCm: 128, chestIn: 50.4, lengthCm: 80, lengthIn: 31.5, shoulderCm: 58, shoulderIn: 22.8 },
    ],
  },
  jersey: {
    name: "Performance Technical Jersey",
    fit: "Athletic Raglan Fit. True to size with aerodynamic stretch and breathable drop hem.",
    rows: [
      { size: "XS", chestCm: 94, chestIn: 37.0, lengthCm: 69, lengthIn: 27.2, shoulderCm: 44, shoulderIn: 17.3 },
      { size: "S", chestCm: 100, chestIn: 39.4, lengthCm: 72, lengthIn: 28.3, shoulderCm: 46, shoulderIn: 18.1 },
      { size: "M", chestCm: 106, chestIn: 41.7, lengthCm: 74, lengthIn: 29.1, shoulderCm: 48, shoulderIn: 18.9 },
      { size: "L", chestCm: 112, chestIn: 44.1, lengthCm: 76, lengthIn: 30.0, shoulderCm: 50, shoulderIn: 19.7 },
      { size: "XL", chestCm: 118, chestIn: 46.5, lengthCm: 78, lengthIn: 30.7, shoulderCm: 52, shoulderIn: 20.5 },
      { size: "XXL", chestCm: 124, chestIn: 48.8, lengthCm: 80, lengthIn: 31.5, shoulderCm: 54, shoulderIn: 21.3 },
    ],
  },
  hoodie: {
    name: "Technical Fleece Hoodie",
    fit: "Relaxed Streetwear Silhouette. Pre-shrunk 320 GSM French Terry with double-lined crossover hood.",
    rows: [
      { size: "S", chestCm: 112, chestIn: 44.1, lengthCm: 70, lengthIn: 27.6, shoulderCm: 52, shoulderIn: 20.5 },
      { size: "M", chestCm: 118, chestIn: 46.5, lengthCm: 72, lengthIn: 28.3, shoulderCm: 54, shoulderIn: 21.3 },
      { size: "L", chestCm: 124, chestIn: 48.8, lengthCm: 74, lengthIn: 29.1, shoulderCm: 56, shoulderIn: 22.0 },
      { size: "XL", chestCm: 130, chestIn: 51.2, lengthCm: 76, lengthIn: 30.0, shoulderCm: 58, shoulderIn: 22.8 },
      { size: "XXL", chestCm: 136, chestIn: 53.5, lengthCm: 78, lengthIn: 30.7, shoulderCm: 60, shoulderIn: 23.6 },
    ],
  },
};

export default function SizeGuideModal({
  isOpen,
  onClose,
  defaultType = "tee",
}: SizeGuideModalProps) {
  const [activeType, setActiveType] = useState<"tee" | "jersey" | "hoodie">(defaultType);
  const [prevDefaultType, setPrevDefaultType] = useState(defaultType);
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (prevDefaultType !== defaultType) {
    setPrevDefaultType(defaultType);
    setActiveType(defaultType);
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

  if (!isOpen) return null;

  const currentChart = SIZE_CHARTS[activeType];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-1 border border-border text-foreground shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted block mb-1">
              Precision Fit Matrix
            </span>
            <h2 id="size-guide-title" className="font-mono text-xl uppercase tracking-wider text-foreground">
              Apparel Size Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="w-8 h-8 flex items-center justify-center border border-border-subtle hover:border-border hover:bg-surface-2 transition-colors font-mono text-sm text-text-secondary hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Garment Type Tabs & Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex border border-border-subtle p-0.5 bg-surface-2">
            <button
              onClick={() => setActiveType("tee")}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeType === "tee" ? "bg-foreground text-background font-bold" : "text-text-secondary hover:text-foreground"
              }`}
            >
              Heavy Tee
            </button>
            <button
              onClick={() => setActiveType("jersey")}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeType === "jersey" ? "bg-foreground text-background font-bold" : "text-text-secondary hover:text-foreground"
              }`}
            >
              Jersey
            </button>
            <button
              onClick={() => setActiveType("hoodie")}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeType === "hoodie" ? "bg-foreground text-background font-bold" : "text-text-secondary hover:text-foreground"
              }`}
            >
              Hoodie
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Unit:</span>
            <div className="flex border border-border-subtle bg-surface-2 p-0.5">
              <button
                onClick={() => setUnit("cm")}
                className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  unit === "cm" ? "bg-surface-3 text-foreground font-bold" : "text-text-muted hover:text-foreground"
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit("in")}
                className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  unit === "in" ? "bg-surface-3 text-foreground font-bold" : "text-text-muted hover:text-foreground"
                }`}
              >
                INCHES
              </button>
            </div>
          </div>
        </div>

        {/* Fit note */}
        <div className="border border-border-subtle bg-surface-2/60 p-3 mb-6">
          <div className="flex items-start gap-2">
            <span className="font-mono text-emerald-400 text-xs">ℹ</span>
            <p className="font-mono text-[10px] text-text-secondary leading-relaxed">
              <span className="text-foreground font-semibold">{currentChart.name}:</span> {currentChart.fit}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6 border border-border-subtle">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-2 border-b border-border-subtle text-[10px] uppercase tracking-wider text-text-muted">
              <tr>
                <th className="py-2.5 px-4 font-bold">Size</th>
                <th className="py-2.5 px-4">Chest ({unit})</th>
                <th className="py-2.5 px-4">Length ({unit})</th>
                <th className="py-2.5 px-4">Shoulder ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {currentChart.rows.map((row) => (
                <tr key={row.size} className="hover:bg-surface-2/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-foreground">{row.size}</td>
                  <td className="py-2.5 px-4 text-text-secondary">
                    {unit === "cm" ? `${row.chestCm} cm` : `${row.chestIn}"`}
                  </td>
                  <td className="py-2.5 px-4 text-text-secondary">
                    {unit === "cm" ? `${row.lengthCm} cm` : `${row.lengthIn}"`}
                  </td>
                  <td className="py-2.5 px-4 text-text-secondary">
                    {unit === "cm" ? `${row.shoulderCm} cm` : `${row.shoulderIn}"`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring tips */}
        <div className="border-t border-border-subtle pt-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted block mb-2">
            How to measure:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px] text-text-muted">
            <div className="bg-surface-2 p-2.5 border border-border-subtle">
              <strong className="text-foreground block mb-0.5">1. Chest:</strong>
              Measure around the fullest part of your chest, keeping the tape horizontal under your arms.
            </div>
            <div className="bg-surface-2 p-2.5 border border-border-subtle">
              <strong className="text-foreground block mb-0.5">2. Length:</strong>
              Measure from the highest point of the shoulder seam straight down to the bottom hem.
            </div>
            <div className="bg-surface-2 p-2.5 border border-border-subtle">
              <strong className="text-foreground block mb-0.5">3. Shoulder:</strong>
              Measure across the upper back from the tip of one shoulder bone to the other.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
