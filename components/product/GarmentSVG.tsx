"use client";

interface GarmentSVGProps {
  type: "jersey" | "tee" | "hoodie";
  color: string;
  designUrl?: string | null;
  className?: string;
  view?: "front" | "back";
}

function TeeSilhouette({ color, isBack = false }: { color: string; isBack?: boolean }) {
  const strokeColor = color === "#f4f4f5" ? "#333" : "#111";
  const seamColor = color === "#f4f4f5" ? "#555" : "#222";
  const shadowColor = color === "#f4f4f5" ? "#e4e4e7" : "#1a1a1a";

  return (
    <g>
      {/* Main Tee Body */}
      <path
        d={
          isBack
            ? "M 120,40 L 100,38 L 78,50 L 55,44 L 48,60 L 68,68 L 72,58 L 74,95 L 74,230 Q 74,238 82,240 L 218,240 Q 226,238 226,230 L 226,95 L 228,58 L 232,68 L 252,60 L 245,44 L 222,50 L 200,38 L 180,40 Q 150,44 120,40 Z"
            : "M 120,40 L 100,38 L 78,50 L 55,44 L 48,60 L 68,68 L 72,58 L 74,95 L 74,230 Q 74,238 82,240 L 218,240 Q 226,238 226,230 L 226,95 L 228,58 L 232,68 L 252,60 L 245,44 L 222,50 L 200,38 L 180,40 Q 170,48 150,52 Q 140,54 140,62 L 140,68 Q 140,72 136,74 Q 130,78 160,80 L 140,80 Q 110,78 104,74 Q 100,72 100,68 L 100,62 Q 100,54 90,52 Q 80,48 120,40 Z"
        }
        fill={color}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Left Sleeve Seam */}
      <path
        d="M 100,38 L 78,50 L 55,44 L 48,60 L 68,68 L 72,58 L 74,95"
        fill="none"
        stroke={seamColor}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Right Sleeve Seam */}
      <path
        d="M 200,38 L 222,50 L 245,44 L 252,60 L 232,68 L 228,58 L 226,95"
        fill="none"
        stroke={seamColor}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Side Seams */}
      <path
        d="M 74,95 L 74,230"
        fill="none"
        stroke={seamColor}
        strokeWidth="0.6"
        opacity="0.3"
      />
      <path
        d="M 226,95 L 226,230"
        fill="none"
        stroke={seamColor}
        strokeWidth="0.6"
        opacity="0.3"
      />
      {/* Hem Stitching */}
      <line x1="82" y1="234" x2="218" y2="234" stroke={seamColor} strokeWidth="0.6" strokeDasharray="3 2" opacity="0.35" />
      
      {/* Collar detail */}
      {isBack ? (
        <g>
          {/* Back collar curve */}
          <path
            d="M 120,40 Q 150,45 180,40"
            fill="none"
            stroke={seamColor}
            strokeWidth="1.2"
            opacity="0.5"
          />
          {/* Back Yoke line */}
          <line x1="100" y1="65" x2="200" y2="65" stroke={seamColor} strokeWidth="0.6" opacity="0.25" strokeDasharray="4 2" />
        </g>
      ) : (
        <path
          d="M 120,40 Q 170,48 150,52 Q 140,54 140,62 L 140,68 Q 140,72 136,74 Q 130,78 160,80 L 140,80 Q 110,78 104,74 Q 100,72 100,68 L 100,62 Q 100,54 90,52 Q 80,48 120,40"
          fill={shadowColor}
          opacity="0.3"
        />
      )}
    </g>
  );
}

function JerseySilhouette({ color, isBack = false }: { color: string; isBack?: boolean }) {
  const strokeColor = color === "#f4f4f5" ? "#333" : "#111";
  const seamColor = color === "#f4f4f5" ? "#555" : "#222";
  const shadowColor = color === "#f4f4f5" ? "#e4e4e7" : "#1a1a1a";

  return (
    <g>
      <path
        d={
          isBack
            ? "M 120,38 L 98,36 L 72,48 L 40,40 L 32,62 L 62,72 L 68,56 L 70,90 L 70,232 Q 70,240 78,242 L 222,242 Q 230,240 230,232 L 230,90 L 232,56 L 238,72 L 268,62 L 260,40 L 228,48 L 202,36 L 180,38 Q 150,42 120,38 Z"
            : "M 120,38 L 98,36 L 72,48 L 40,40 L 32,62 L 62,72 L 68,56 L 70,90 L 70,232 Q 70,240 78,242 L 222,242 Q 230,240 230,232 L 230,90 L 232,56 L 238,72 L 268,62 L 260,40 L 228,48 L 202,36 L 180,38 Q 168,50 150,56 Q 142,58 142,66 L 142,74 Q 142,78 136,80 L 164,80 L 136,80 Q 108,78 104,74 Q 98,66 98,66 L 98,56 Q 98,56 90,52 Q 78,48 120,38 Z"
        }
        fill={color}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Raglan sleeve lines */}
      <path
        d="M 98,36 L 72,48 L 40,40 L 32,62 L 62,72 L 68,56 L 70,90"
        fill="none"
        stroke={seamColor}
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M 202,36 L 228,48 L 260,40 L 268,62 L 238,72 L 232,56 L 230,90"
        fill="none"
        stroke={seamColor}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Athletic side mesh panel accents */}
      <line x1="70" y1="120" x2="70" y2="230" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
      <line x1="230" y1="120" x2="230" y2="230" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
      
      {/* Collar */}
      {isBack ? (
        <path
          d="M 120,38 Q 150,43 180,38"
          fill="none"
          stroke={seamColor}
          strokeWidth="1.2"
          opacity="0.5"
        />
      ) : (
        <>
          <line x1="120" y1="40" x2="120" y2="56" stroke={seamColor} strokeWidth="0.5" opacity="0.3" />
          <line x1="180" y1="40" x2="180" y2="56" stroke={seamColor} strokeWidth="0.5" opacity="0.3" />
          <path
            d="M 120,38 Q 170,50 150,56 Q 142,58 142,66 L 142,74 Q 142,78 136,80 L 164,80 L 136,80 Q 108,78 104,74 Q 98,66 98,66 L 98,56 Q 98,56 90,52 Q 78,48 120,38"
            fill={shadowColor}
            opacity="0.3"
          />
        </>
      )}
    </g>
  );
}

function HoodieSilhouette({ color, isBack = false }: { color: string; isBack?: boolean }) {
  const strokeColor = color === "#f4f4f5" ? "#333" : "#111";
  const seamColor = color === "#f4f4f5" ? "#555" : "#222";
  const shadowColor = color === "#f4f4f5" ? "#e4e4e7" : "#1a1a1a";

  return (
    <g>
      {/* Main Body */}
      <path
        d="M 118,34 L 94,32 L 68,46 L 34,38 L 26,62 L 58,72 L 64,54 L 68,88 L 68,234 Q 68,242 76,244 L 224,244 Q 232,242 232,234 L 232,88 L 236,54 L 242,72 L 274,62 L 266,38 L 232,46 L 206,32 L 182,34 Q 170,42 158,48 L 150,52 Q 144,54 144,60 L 144,68 Q 144,72 140,74 Q 134,78 166,80 L 134,80 Q 106,78 100,74 Q 96,72 96,68 L 96,60 Q 96,54 90,52 L 82,48 Q 70,42 118,34 Z"
        fill={color}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Sleeves */}
      <path d="M 34,38 L 26,62 L 58,72 L 64,54 L 68,88" fill="none" stroke={seamColor} strokeWidth="0.8" opacity="0.4" />
      <path d="M 266,38 L 274,62 L 242,72 L 236,54 L 232,88" fill="none" stroke={seamColor} strokeWidth="0.8" opacity="0.4" />
      {/* Body Side Seams */}
      <path d="M 68,88 L 68,234" fill="none" stroke={seamColor} strokeWidth="0.6" opacity="0.25" />
      <path d="M 232,88 L 232,234" fill="none" stroke={seamColor} strokeWidth="0.6" opacity="0.25" />
      {/* Ribbed Hem & Cuffs */}
      <path d="M 68,234 Q 68,242 76,244 L 224,244 Q 232,242 232,234" fill="none" stroke={seamColor} strokeWidth="0.8" opacity="0.35" />

      {isBack ? (
        <g>
          {/* Back hood drape silhouette */}
          <path
            d="M 100,40 Q 150,85 200,40 Q 170,34 150,34 Q 130,34 100,40 Z"
            fill={shadowColor}
            stroke={seamColor}
            strokeWidth="1"
            opacity="0.5"
          />
          {/* Hood seam in center */}
          <line x1="150" y1="34" x2="150" y2="70" stroke={seamColor} strokeWidth="0.7" opacity="0.3" />
        </g>
      ) : (
        <g>
          {/* Hood crossover neck */}
          <path
            d="M 118,34 Q 158,42 150,52 Q 144,54 144,60 L 144,68 Q 144,72 140,74 Q 134,78 166,80 L 134,80 Q 106,78 100,74 Q 96,72 96,68 L 96,60 Q 96,54 90,52 Q 82,42 118,34"
            fill={shadowColor}
            opacity="0.3"
          />
          {/* Kangaroo Pocket */}
          <path
            d="M 100,165 L 100,195 Q 100,205 110,205 L 190,205 Q 200,205 200,195 L 200,165 Q 190,168 180,168 L 120,168 Q 110,168 100,165 Z"
            fill="none"
            stroke={seamColor}
            strokeWidth="0.9"
            opacity="0.45"
          />
        </g>
      )}
    </g>
  );
}

export default function GarmentSVG({
  type,
  color,
  designUrl,
  className = "",
  view = "front",
}: GarmentSVGProps) {
  const isBack = view === "back";

  const renderSilhouette = () => {
    switch (type) {
      case "jersey":
        return <JerseySilhouette color={color} isBack={isBack} />;
      case "hoodie":
        return <HoodieSilhouette color={color} isBack={isBack} />;
      default:
        return <TeeSilhouette color={color} isBack={isBack} />;
    }
  };

  // Canvas bounds on SVG for front vs back
  const designArea = isBack
    ? type === "hoodie"
      ? { x: 110, y: 115, w: 98, h: 98 }
      : { x: 112, y: 92, w: 96, h: 96 }
    : type === "hoodie"
      ? { x: 110, y: 105, w: 92, h: 92 }
      : type === "jersey"
        ? { x: 110, y: 95, w: 96, h: 96 }
        : { x: 112, y: 95, w: 96, h: 96 };

  return (
    <svg
      viewBox="0 0 300 260"
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderSilhouette()}
      {designUrl && (
        <foreignObject
          x={designArea.x}
          y={designArea.y}
          width={designArea.w}
          height={designArea.h}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={designUrl}
            alt="Custom Design Print"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: 0.95,
              mixBlendMode: color === "#f4f4f5" ? "multiply" : "screen",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          />
        </foreignObject>
      )}
    </svg>
  );
}
