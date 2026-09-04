"use client";

import React, { useState, useRef, useCallback } from "react";

interface MagnifierLensProps {
  children: React.ReactNode;
  zoomLevel?: number;
  lensSize?: number;
  className?: string;
}

export default function MagnifierLens({
  children,
  zoomLevel = 2.2,
  lensSize = 150,
  className = "",
}: MagnifierLensProps) {
  const [isActive, setIsActive] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, percentX: 0, percentY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Clamped within container boundaries
      const clampedX = Math.max(0, Math.min(x, rect.width));
      const clampedY = Math.max(0, Math.min(y, rect.height));

      const percentX = (clampedX / rect.width) * 100;
      const percentY = (clampedY / rect.height) * 100;

      setCoords({ x: clampedX, y: clampedY, percentX, percentY });
    },
    []
  );

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsActive(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsActive(false)}
      className={`relative select-none cursor-crosshair group ${className}`}
    >
      {/* Base Display */}
      {children}

      {/* Floating Magnifier Loupe */}
      {isActive && (
        <div
          className="pointer-events-none absolute hidden md:block rounded-full border-2 border-foreground/80 shadow-[0_0_25px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,255,255,0.15)] bg-surface-1 overflow-hidden z-30 transition-transform duration-75"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${coords.x - lensSize / 2}px`,
            top: `${coords.y - lensSize / 2}px`,
          }}
        >
          {/* Zoomed Clone Container */}
          <div
            className="absolute inset-0"
            style={{
              width: `${zoomLevel * 100}%`,
              height: `${zoomLevel * 100}%`,
              transform: `translate(-${coords.percentX * (zoomLevel - 1)}%, -${coords.percentY * (zoomLevel - 1)}%) scale(${zoomLevel})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>

          {/* Crosshairs & Macro Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-0.5 bg-emerald-400/80" />
            <div className="h-4 w-0.5 bg-emerald-400/80 -ml-2.5" />
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/90 px-1.5 py-0.5 border border-border-subtle rounded-xs">
            <span className="font-mono text-[7px] uppercase tracking-widest text-emerald-400 font-bold">
              {zoomLevel}x Macro
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
