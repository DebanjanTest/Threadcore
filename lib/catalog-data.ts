import type {
  ApparelSKU,
  PrintLocation,
  PrintTechnique,
  FileSpecs,
  CatalogResponse,
} from "./types";

export const APPAREL_COLORS = [
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "white", name: "White", hex: "#f4f4f5" },
  { id: "charcoal", name: "Charcoal", hex: "#404040" },
  { id: "heather", name: "Heather Grey", hex: "#737373" },
  { id: "off-black", name: "Off Black", hex: "#262626" },
];

export const DEFAULT_APPAREL_ANGLES = [
  { id: "front" as const, label: "Front Angle", tag: "Frontal Silhouette", description: "Straight-on view showing neckline ribbing and front custom print canvas." },
  { id: "back" as const, label: "Back Angle", tag: "Rear Yoke", description: "Clean back silhouette showing seamless shoulder line and back print canvas." },
  { id: "macro" as const, label: "Macro Weave", tag: "Fabric Detail (2.5x)", description: "Extreme close-up inspecting knit yarn density and high-tension flatlock seams." },
  { id: "model" as const, label: "Model Fit", tag: "On-Body Proportion", description: "Streetwear lookbook styling showing true shoulder drop and drape." },
];

export const APPAREL_SKUS: ApparelSKU[] = [
  {
    id: "TC-JER-001",
    name: "Performance Jersey",
    type: "jersey",
    basePricePaise: 89900,
    originalPricePaise: 129900,
    canvasBounds: {
      front: { widthMm: 300, heightMm: 400 },
      back: { widthMm: 280, heightMm: 350 },
      leftSleeve: { widthMm: 100, heightMm: 200 },
      rightSleeve: { widthMm: 100, heightMm: 200 },
    },
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    availableColors: APPAREL_COLORS,
    description: "Breathable polyester performance jersey with ergonomic raglan sleeves and moisture-wicking weave.",
    category: "jerseys",
    badge: "ATHLETIC TECH",
    rating: 4.9,
    reviewCount: 96,
    material: "100% Breathable Micro-Poly",
    weightGsm: 180,
    modelFitInfo: "Model is 188cm / 80kg wearing size L (Athletic Ergonomic Fit)",
    angles: DEFAULT_APPAREL_ANGLES,
    images: {
      front: "https://images.unsplash.com/photo-1580089595767-98745d7025c5?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=1000&q=85",
      macro: "https://images.unsplash.com/photo-1637004732258-4b792ce8f474?auto=format&fit=crop&w=1000&q=85",
      model: "https://images.unsplash.com/photo-1758745369561-e963bc5202fe?auto=format&fit=crop&w=1000&q=85",
      byColor: {
        black: {
          front: "https://images.unsplash.com/photo-1580089595767-98745d7025c5?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=1000&q=85",
        },
        white: {
          front: "https://images.unsplash.com/photo-1551330299-3db95c0ca3d4?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=1000&q=85",
        },
        charcoal: {
          front: "https://images.unsplash.com/photo-1580089595767-98745d7025c5?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=1000&q=85",
        },
        heather: {
          front: "https://images.unsplash.com/photo-1551330299-3db95c0ca3d4?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=1000&q=85",
        },
        "off-black": {
          front: "https://images.unsplash.com/photo-1580089595767-98745d7025c5?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1752166672544-c31d040b3b8f?auto=format&fit=crop&w=1000&q=85",
        },
      },
    },
  },
  {
    id: "TC-TEE-001",
    name: "Heavyweight Tee",
    type: "tee",
    basePricePaise: 59900,
    originalPricePaise: 89900,
    canvasBounds: {
      front: { widthMm: 280, heightMm: 350 },
      back: { widthMm: 260, heightMm: 320 },
      leftSleeve: { widthMm: 80, heightMm: 180 },
      rightSleeve: { widthMm: 80, heightMm: 180 },
    },
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    availableColors: APPAREL_COLORS,
    description: "220 GSM ring-spun combed cotton heavyweight tee with boxy streetwear drape and 1.25\" thick collar.",
    category: "tees",
    badge: "BESTSELLER",
    rating: 4.95,
    reviewCount: 182,
    material: "100% Combed Ring-Spun Cotton",
    weightGsm: 220,
    modelFitInfo: "Model is 185cm / 75kg wearing size L (Boxy Streetwear Oversized Fit)",
    angles: DEFAULT_APPAREL_ANGLES,
    images: {
      front: "/pictures/black-tshirt.png",
      back: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=1000&q=85",
      macro: "https://images.unsplash.com/photo-1594332495179-d979bcd18142?auto=format&fit=crop&w=1000&q=85",
      model: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=85",
      byColor: {
        black: {
          front: "/pictures/black-tshirt.png",
          back: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=1000&q=85",
        },
        white: {
          front: "/pictures/white-tshirt.png",
          back: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=1000&q=85",
        },
        charcoal: {
          front: "/pictures/charcoal-tshirt.png",
          back: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=1000&q=85",
        },
        heather: {
          front: "/pictures/heather-tshirt.png",
          back: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=1000&q=85",
        },
        "off-black": {
          front: "/pictures/off-black-tshirt.png",
          back: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=1000&q=85",
        },
      },
    },
  },
  {
    id: "TC-HOD-001",
    name: "Technical Hoodie",
    type: "hoodie",
    basePricePaise: 129900,
    originalPricePaise: 179900,
    canvasBounds: {
      front: { widthMm: 300, heightMm: 420 },
      back: { widthMm: 280, heightMm: 380 },
      leftSleeve: { widthMm: 100, heightMm: 220 },
      rightSleeve: { widthMm: 100, heightMm: 220 },
    },
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: APPAREL_COLORS,
    description: "320 GSM French Terry fleece-lined technical hoodie with double-layer crossover hood & kangaroo pocket.",
    category: "hoodies",
    badge: "PREMIUM DROP",
    rating: 4.88,
    reviewCount: 64,
    material: "80% Cotton / 20% Poly French Terry",
    weightGsm: 320,
    modelFitInfo: "Model is 182cm / 78kg wearing size XL (Relaxed Drop-Shoulder Fit)",
    angles: DEFAULT_APPAREL_ANGLES,
    images: {
      front: "https://images.unsplash.com/photo-1555644459-c1fa07852459?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1000&q=85",
      macro: "https://images.unsplash.com/photo-1643313262763-4056bfa99dd7?auto=format&fit=crop&w=1000&q=85",
      model: "https://images.unsplash.com/photo-1576110621281-b1cd0e258162?auto=format&fit=crop&w=1000&q=85",
      byColor: {
        black: {
          front: "https://images.unsplash.com/photo-1555644459-c1fa07852459?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1000&q=85",
        },
        white: {
          front: "https://images.unsplash.com/photo-1616030257764-0fe6a2f05138?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1000&q=85",
        },
        charcoal: {
          front: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1000&q=85",
        },
        heather: {
          front: "https://images.unsplash.com/photo-1632073143817-8cd5b2165e20?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1000&q=85",
        },
        "off-black": {
          front: "https://images.unsplash.com/photo-1555644459-c1fa07852459?auto=format&fit=crop&w=1000&q=85",
          back: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1000&q=85",
        },
      },
    },
  },
];

export const PRINT_LOCATIONS: PrintLocation[] = [
  {
    id: "front-center",
    name: "Front Center",
    surchargePaise: 0,
    areaMultiplier: 1.0,
    compatibleSKUs: ["TC-JER-001", "TC-TEE-001", "TC-HOD-001"],
  },
  {
    id: "back-center",
    name: "Back Center",
    surchargePaise: 5000,
    areaMultiplier: 0.85,
    compatibleSKUs: ["TC-JER-001", "TC-TEE-001", "TC-HOD-001"],
  },
  {
    id: "left-sleeve",
    name: "Left Sleeve",
    surchargePaise: 3000,
    areaMultiplier: 0.3,
    compatibleSKUs: ["TC-JER-001", "TC-TEE-001", "TC-HOD-001"],
  },
  {
    id: "right-sleeve",
    name: "Right Sleeve",
    surchargePaise: 3000,
    areaMultiplier: 0.3,
    compatibleSKUs: ["TC-JER-001", "TC-TEE-001", "TC-HOD-001"],
  },
];

export const PRINT_TECHNIQUES: PrintTechnique[] = [
  {
    id: "dtg",
    name: "Direct to Garment (DTG)",
    areaMarkupPercent: 15,
    description: "High-resolution inkjet printing directly onto fabric",
  },
  {
    id: "sublimation",
    name: "Sublimation",
    areaMarkupPercent: 20,
    description: "Heat-transfer dye process for all-over vibrant prints",
  },
  {
    id: "screen-print",
    name: "Screen Print",
    areaMarkupPercent: 10,
    description: "Traditional silk-screen printing for bold, durable designs",
  },
];

export const FILE_SPECS: FileSpecs = {
  maxWidthPx: 4000,
  maxHeightPx: 4000,
  acceptedFormats: ["image/png", "image/svg+xml"],
  maxFileSizeBytes: 10 * 1024 * 1024,
};

export const GST_RATE = 0.18;

export const CATALOG: CatalogResponse = {
  "@context": "https://threadcore.dev/schema/catalog/v1",
  "@type": "ApparelCatalog",
  schemaVersion: "1.0.0",
  catalogId: "THREADCORE-2026-001",
  skus: APPAREL_SKUS,
  printLocations: PRINT_LOCATIONS,
  printTechniques: PRINT_TECHNIQUES,
  fileSpecs: FILE_SPECS,
  budgetCeilingPaise: 500000,
  currency: "INR",
};

export function getSKUById(id: string): ApparelSKU | undefined {
  return APPAREL_SKUS.find((s) => s.id === id);
}

export function getPrintLocationById(id: string): PrintLocation | undefined {
  return PRINT_LOCATIONS.find((l) => l.id === id);
}

export function getPrintTechniqueById(id: string): PrintTechnique | undefined {
  return PRINT_TECHNIQUES.find((t) => t.id === id);
}

export function getSKUImage(
  sku: ApparelSKU,
  angle: "front" | "back" | "macro" | "model" = "front",
  colorId?: string
): string {
  if (colorId && sku.images?.byColor && sku.images.byColor[colorId]) {
    const colorImgs = sku.images.byColor[colorId];
    if (angle === "front") return colorImgs.front;
    if (angle === "back") return colorImgs.back;
  }
  return sku.images?.[angle] || sku.images?.front || "";
}

export const EDITORIAL_LOOKBOOK_IMAGES = {
  heroTee: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=85",
  collarMacro: "https://images.unsplash.com/photo-1594332495179-d979bcd18142?auto=format&fit=crop&w=1000&q=85",
  printDetail: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
  hoodieBlank: "https://images.unsplash.com/photo-1555644459-c1fa07852459?auto=format&fit=crop&w=1000&q=85",
  hoodieModel: "https://images.unsplash.com/photo-1576110621281-b1cd0e258162?auto=format&fit=crop&w=1000&q=85",
  urbanEditorial: "https://images.unsplash.com/photo-1552168212-9ceb61083ba0?auto=format&fit=crop&w=1000&q=85",
};
