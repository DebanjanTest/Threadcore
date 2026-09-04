export interface CanvasBounds {
  widthMm: number;
  heightMm: number;
}

export interface SKUImages {
  front: string;
  back: string;
  macro: string;
  model: string;
  byColor?: Record<string, { front: string; back: string }>;
}

export interface ApparelSKU {
  id: string;
  name: string;
  type: "jersey" | "tee" | "hoodie";
  basePricePaise: number;
  originalPricePaise?: number;
  canvasBounds: Record<string, CanvasBounds>;
  availableSizes: string[];
  availableColors: ApparelColor[];
  description: string;
  category?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  material?: string;
  weightGsm?: number;
  modelFitInfo?: string;
  angles?: ProductAngle[];
  images: SKUImages;
}

export interface ProductAngle {
  id: "front" | "back" | "macro" | "model";
  label: string;
  tag: string;
  description: string;
}

export interface CartItem {
  id: string;
  skuId: string;
  name: string;
  type: "jersey" | "tee" | "hoodie";
  color: ApparelColor;
  size: string;
  printLocations: string[];
  printTechnique: string;
  quantity: number;
  unitPricePaise: number;
  totalPaise: number;
  designPreview: string | null;
  designName?: string;
}

export interface ApparelColor {
  id: string;
  name: string;
  hex: string;
}

export interface PrintLocation {
  id: string;
  name: string;
  surchargePaise: number;
  areaMultiplier: number;
  compatibleSKUs: string[];
}

export interface PrintTechnique {
  id: string;
  name: string;
  areaMarkupPercent: number;
  description: string;
}

export interface FileSpecs {
  maxWidthPx: number;
  maxHeightPx: number;
  acceptedFormats: string[];
  maxFileSizeBytes: number;
}

export interface CatalogResponse {
  "@context": string;
  "@type": string;
  schemaVersion: string;
  catalogId: string;
  skus: ApparelSKU[];
  printLocations: PrintLocation[];
  printTechniques: PrintTechnique[];
  fileSpecs: FileSpecs;
  budgetCeilingPaise: number;
  currency: string;
}

export interface PricingLineItem {
  label: string;
  amountPaise: number;
  type: "base" | "surcharge" | "markup" | "tax" | "total";
}

export interface PricingBreakdown {
  garmentBasePaise: number;
  printLocationSurchargePaise: number;
  surfaceAreaMarkupPaise: number;
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
  unitTotalPaise?: number;
  lineItems: PricingLineItem[];
}

export interface RemediationContext {
  isRemediated: boolean;
  source: "SELF_HEALING_BUDGET_REMEDIER";
  title: string;
  originalQty: number;
  remediatedQty: number;
  originalTotalPaise: number;
  boundedTotalPaise: number;
  savingsPaise: number;
  reason: string;
}

export interface AgentEvaluateRequest {
  skuId: string;
  printLocationIds: string[];
  printTechniqueId: string;
  quantity: number;
  designFileDimensions?: { widthPx: number; heightPx: number };
}

export interface AgentRemediation {
  suggestedSkuId?: string;
  suggestedPrintLocations?: string[];
  suggestedQuantity?: number;
  estimatedSavingsPaise: number;
  newTotalPaise: number;
  explanation: string;
}

export interface AgentEvaluateResponse {
  pricing: PricingBreakdown;
  unitPricing: PricingBreakdown;
  quantity: number;
  withinBudget: boolean;
  budgetCeilingPaise: number;
  validationErrors: string[];
  recommendation: string;
  remediation?: AgentRemediation;
}

export type AuditStep =
  | "SCHEMA_FETCH"
  | "CANVAS_VALIDATION"
  | "BOUND_CHECK"
  | "RZP_ORDER_CREATE"
  | "PAYMENT_VERIFY"
  | "PAYMENT_FAILED"
  | "AGENT_EVALUATE"
  | "CHECKOUT_INIT";

export type AuditStatus = "success" | "error" | "pending" | "info";

export interface AuditEntry {
  id: string;
  timestamp: string;
  step: AuditStep;
  status: AuditStatus;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface CheckoutPayload {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerificationPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  orderId: string;
  status: string;
}

export type CheckoutState = "idle" | "processing" | "success" | "failed" | "recovering";

export interface StudioConfig {
  selectedSKU: string;
  selectedColor: string;
  selectedSize: string;
  printLocations: string[];
  printTechnique: string;
  quantity: number;
  designFile: File | null;
  designPreview: string | null;
  designDimensions: { widthPx: number; heightPx: number } | null;
}
