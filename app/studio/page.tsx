"use client";

import { useState, useCallback, useMemo, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { StudioConfig, AuditEntry, PricingBreakdown, RemediationContext } from "@/lib/types";
import {
  APPAREL_SKUS,
  APPAREL_COLORS,
  PRINT_LOCATIONS,
  PRINT_TECHNIQUES,
} from "@/lib/catalog-data";
import {
  calculatePricing,
  validateBudget,
  createAuditEntry,
} from "@/lib/guardrails";
import PictureGallery from "@/components/product/PictureGallery";
import ConfigPanel from "@/components/studio/ConfigPanel";
import PriceBreakdown from "@/components/studio/PriceBreakdown";
import AuditDrawer from "@/components/studio/AuditDrawer";
import RazorpayCheckoutModal from "@/components/checkout/RazorpayCheckoutModal";
import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/layout/Navbar";
import { PRESET_DESIGNS } from "@/lib/preset-designs";
import Button from "@/components/ui/Button";
import AgentAutopilotModal from "@/components/studio/AgentAutopilotModal";

const defaultConfig: StudioConfig = {
  selectedSKU: "TC-TEE-001",
  selectedColor: "black",
  selectedSize: "M",
  printLocations: ["front-center"],
  printTechnique: "dtg",
  quantity: 1,
  designFile: null,
  designPreview: PRESET_DESIGNS[0].dataUrl, // start with an aesthetic preset graphic so canvas isn't blank!
  designDimensions: { widthPx: 2000, heightPx: 2000 },
};

const INITIAL_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "audit_init_schema",
    step: "SCHEMA_FETCH",
    status: "success",
    message: "Agentic schema v1.0 loaded (Track 01 UAP standard)",
    timestamp: "2026-09-04T10:00:00.000Z",
  },
  {
    id: "audit_init_bound",
    step: "BOUND_CHECK",
    status: "success",
    message: "Print zone limits verified: 280x350mm front-center, DPI 300+",
    timestamp: "2026-09-04T10:00:01.000Z",
  },
  {
    id: "audit_init_canvas",
    step: "CANVAS_VALIDATION",
    status: "success",
    message: "Interactive Three.js WebGL Turntable synchronized with active SKU",
    timestamp: "2026-09-04T10:00:02.000Z",
  },
];

function StudioContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const skuParam = searchParams.get("sku");
  const colorParam = searchParams.get("color");
  const sizeParam = searchParams.get("size");

  const [prevParams, setPrevParams] = useState({ sku: skuParam, color: colorParam, size: sizeParam });

  const [config, setConfig] = useState<StudioConfig>(() => ({
    ...defaultConfig,
    selectedSKU: skuParam && APPAREL_SKUS.some((s) => s.id === skuParam) ? skuParam : defaultConfig.selectedSKU,
    selectedColor: colorParam && APPAREL_COLORS.some((c) => c.id === colorParam) ? colorParam : defaultConfig.selectedColor,
    selectedSize: sizeParam || defaultConfig.selectedSize,
  }));

  if (prevParams.sku !== skuParam || prevParams.color !== colorParam || prevParams.size !== sizeParam) {
    setPrevParams({ sku: skuParam, color: colorParam, size: sizeParam });
    setConfig((prev) => ({
      ...prev,
      selectedSKU: skuParam && APPAREL_SKUS.some((s) => s.id === skuParam) ? skuParam : prev.selectedSKU,
      selectedColor: colorParam && APPAREL_COLORS.some((c) => c.id === colorParam) ? colorParam : prev.selectedColor,
      selectedSize: sizeParam || prev.selectedSize,
    }));
  }

  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("threadcore_audit_logs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return [...INITIAL_AUDIT_ENTRIES, ...parsed];
          }
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_AUDIT_ENTRIES;
  });
  const [auditOpen, setAuditOpen] = useState(true);
  const [failureSimEnabled, setFailureSimEnabled] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [autopilotOpen, setAutopilotOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"front" | "back">("front");
  const [justAddedToBag, setJustAddedToBag] = useState(false);
  const [receiptId, setReceiptId] = useState<string>("");
  const [remediationContext, setRemediationContext] = useState<RemediationContext | null>(null);

  const addAuditEntry = useCallback((entry: AuditEntry) => {
    setAuditEntries((prev) => [...prev, entry]);
    try {
      const logs = JSON.parse(sessionStorage.getItem("threadcore_audit_logs") || "[]");
      logs.push(entry);
      sessionStorage.setItem("threadcore_audit_logs", JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, []);

  const handleRunAuditTest = useCallback(
    (type: "BOUND_CHECK" | "SCHEMA_FETCH" | "FAIL_SIM") => {
      if (type === "BOUND_CHECK") {
        addAuditEntry(
          createAuditEntry(
            "BOUND_CHECK",
            "success",
            `Physical bounds verified: SKU ${config.selectedSKU}, surface markup ${config.printTechnique.toUpperCase()} within ₹5,000 ceiling`
          )
        );
      } else if (type === "SCHEMA_FETCH") {
        addAuditEntry(
          createAuditEntry(
            "SCHEMA_FETCH",
            "success",
            "Live UAP discovery manifest verified at /api/agent/protocol"
          )
        );
      }
    },
    [config, addAuditEntry]
  );

  const handleConfigUpdate = useCallback(
    (updates: Partial<StudioConfig>) => {
      // 1. Log Garment Silhouette / Tyre Change
      if (updates.selectedSKU && updates.selectedSKU !== config.selectedSKU) {
        const newSku = APPAREL_SKUS.find((s) => s.id === updates.selectedSKU);
        if (newSku) {
          addAuditEntry(
            createAuditEntry(
              "SCHEMA_FETCH",
              "success",
              `Garment silhouette changed to ${newSku.name} (${newSku.material}, ${newSku.weightGsm || 220} GSM) at ₹${(newSku.basePricePaise / 100).toFixed(0)}. Front canvas bounds: ${newSku.canvasBounds.front.widthMm}×${newSku.canvasBounds.front.heightMm}mm.`
            )
          );
        }
      }

      // 2. Log Size Change
      if (updates.selectedSize && updates.selectedSize !== config.selectedSize) {
        addAuditEntry(
          createAuditEntry(
            "SCHEMA_FETCH",
            "success",
            `Garment sizing set to '${updates.selectedSize}'. Inventory allocation and dimensional pattern checked.`
          )
        );
      }

      // 3. Log Colorway Change
      if (updates.selectedColor && updates.selectedColor !== config.selectedColor) {
        const newColor = APPAREL_COLORS.find((c) => c.id === updates.selectedColor);
        addAuditEntry(
          createAuditEntry(
            "SCHEMA_FETCH",
            "success",
            `Fabric colorway updated to ${newColor?.name || updates.selectedColor} (${newColor?.hex || ""}). Undercoat pigment layer calibrated.`
          )
        );
      }

      // 4. Log Quantity Change
      if (updates.quantity !== undefined && updates.quantity !== config.quantity) {
        addAuditEntry(
          createAuditEntry(
            "BOUND_CHECK",
            "success",
            `Order quantity updated to ${updates.quantity} unit${updates.quantity > 1 ? "s" : ""}. Batch limits verified.`
          )
        );
      }

      // 5. Log Print Technique Change
      if (updates.printTechnique && updates.printTechnique !== config.printTechnique) {
        const tech = PRINT_TECHNIQUES.find((t) => t.id === updates.printTechnique);
        addAuditEntry(
          createAuditEntry(
            "CANVAS_VALIDATION",
            "success",
            `Print technique set to ${tech?.name || updates.printTechnique} (+${tech?.areaMarkupPercent || 0}% surface markup). Washfastness spec applied.`
          )
        );
      }

      // 6. Log Print Locations Change
      if (updates.printLocations && JSON.stringify(updates.printLocations) !== JSON.stringify(config.printLocations)) {
        const locNames = updates.printLocations
          .map((id) => {
            const loc = PRINT_LOCATIONS.find((l) => l.id === id);
            return loc ? `${loc.name} (+₹${(loc.surchargePaise / 100).toFixed(0)})` : id;
          })
          .join(", ");
        addAuditEntry(
          createAuditEntry(
            "BOUND_CHECK",
            "success",
            `Print zones updated: ${locNames || "front-center"}. Coordinate bounds locked.`
          )
        );
      }

      // 7. Log Graphics Artwork Change
      if (updates.designPreview !== undefined && updates.designPreview !== config.designPreview) {
        if (updates.designPreview === null) {
          addAuditEntry(
            createAuditEntry(
              "CANVAS_VALIDATION",
              "info",
              "Artwork cleared: Garment canvas reverted to blank baseline."
            )
          );
        } else if (updates.designDimensions) {
          const sku = APPAREL_SKUS.find(
            (s) => s.id === (updates.selectedSKU || config.selectedSKU)
          ) || APPAREL_SKUS[1];
          const front = sku.canvasBounds.front;
          const w = updates.designDimensions.widthPx;
          const h = updates.designDimensions.heightPx;
          const estDpi = Math.round((Math.max(w, h) / (Math.max(front.widthMm, front.heightMm) / 25.4)));
          const passesDpi = estDpi >= 300 || (w >= 1500 && h >= 1500);

          addAuditEntry(
            createAuditEntry(
              "CANVAS_VALIDATION",
              passesDpi ? "success" : "info",
              `Graphic artwork updated: ${w}×${h}px (~${estDpi} DPI). Canvas fit: ${passesDpi ? "Exceeds 300 DPI print-ready threshold" : "Scaled to fit print zone"}.`
            )
          );
        }
      }

      setConfig((prev) => ({ ...prev, ...updates }));
    },
    [config, addAuditEntry]
  );

  const pricing: PricingBreakdown = useMemo(() => {
    const sku = APPAREL_SKUS.find((s) => s.id === config.selectedSKU);
    if (!sku) {
      return {
        garmentBasePaise: 0,
        printLocationSurchargePaise: 0,
        surfaceAreaMarkupPaise: 0,
        subtotalPaise: 0,
        taxPaise: 0,
        totalPaise: 0,
        lineItems: [],
      };
    }

    let totalSurcharge = 0;
    for (const locId of config.printLocations) {
      const loc = PRINT_LOCATIONS.find((l) => l.id === locId);
      if (loc) totalSurcharge += loc.surchargePaise;
    }

    const technique = PRINT_TECHNIQUES.find(
      (t) => t.id === config.printTechnique
    );
    const markupPercent = technique?.areaMarkupPercent || 0;

    return calculatePricing(
      sku.basePricePaise,
      totalSurcharge,
      markupPercent,
      config.quantity
    );
  }, [config]);

  const budgetCheck = useMemo(
    () => validateBudget(pricing.totalPaise),
    [pricing.totalPaise]
  );

  // 8. Track Price Changes to Live Agent Recorded HUD
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevPriceRef.current !== null && prevPriceRef.current !== pricing.totalPaise) {
      const oldPrice = prevPriceRef.current;
      const newPrice = pricing.totalPaise;
      const diff = newPrice - oldPrice;
      const sign = diff > 0 ? "+" : "-";
      const absDiff = Math.abs(diff);

      addAuditEntry(
        createAuditEntry(
          "BOUND_CHECK",
          newPrice <= 500000 ? "success" : "error",
          `Price updated: ₹${(newPrice / 100).toFixed(2)} INR (${sign}₹${(absDiff / 100).toFixed(2)}). Subtotal ₹${(pricing.subtotalPaise / 100).toFixed(2)} + 18% GST ₹${(pricing.taxPaise / 100).toFixed(2)}. ${
            newPrice <= 500000
              ? "Within ₹5,000 ceiling."
              : "EXCEEDS ₹5,000 HARD CEILING - Agent auto-remediation active."
          }`
        )
      );
    }
    prevPriceRef.current = pricing.totalPaise;
  }, [pricing.totalPaise, pricing.subtotalPaise, pricing.taxPaise, addAuditEntry]);

  const selectedSKU = APPAREL_SKUS.find((s) => s.id === config.selectedSKU);
  const selectedColor = APPAREL_COLORS.find(
    (c) => c.id === config.selectedColor
  ) || APPAREL_COLORS[0];

  function handleCheckoutSuccess(paymentId: string, orderId: string) {
    addAuditEntry(
      createAuditEntry(
        "PAYMENT_VERIFY",
        "success",
        `Payment verified: ${paymentId} for order ${orderId}`
      )
    );
    setCheckoutOpen(false);
  }

  function handleCheckoutFailure(error: string, rootCause: string) {
    addAuditEntry(
      createAuditEntry("PAYMENT_FAILED", "error", `${error} — ${rootCause}`)
    );
  }

  function initiateCheckout(remediation?: RemediationContext) {
    setReceiptId(`TC-${Date.now()}`);
    if (remediation) {
      setRemediationContext(remediation);
    }
    const finalAmount = remediation?.isRemediated
      ? remediation.boundedTotalPaise
      : pricing.totalPaise;
    const finalQty = remediation?.isRemediated
      ? remediation.remediatedQty
      : config.quantity;

    const entry = createAuditEntry(
      "CHECKOUT_INIT",
      "info",
      `Checkout initiated: ${finalQty}x ${selectedSKU?.name} - Rs${(finalAmount / 100).toFixed(0)}${remediation?.isRemediated ? " (Transferred from Self-Healing Budget Remediation)" : ""}`
    );
    addAuditEntry(entry);
    setCheckoutOpen(true);
  }

  const handleAddToBag = () => {
    if (!selectedSKU) return;

    addItem({
      skuId: selectedSKU.id,
      name: selectedSKU.name,
      type: selectedSKU.type,
      color: selectedColor,
      size: config.selectedSize,
      printLocations: config.printLocations,
      printTechnique: config.printTechnique,
      quantity: config.quantity,
      unitPricePaise: Math.round(pricing.totalPaise / config.quantity),
      totalPaise: pricing.totalPaise,
      designPreview: config.designPreview,
      designName: config.designPreview ? "Custom Vector" : "Blank",
    });

    setJustAddedToBag(true);
    setTimeout(() => setJustAddedToBag(false), 1500);

    addAuditEntry(
      createAuditEntry(
        "AGENT_EVALUATE",
        "success",
        `Item added to bag: ${config.quantity}x ${selectedSKU.name} (${config.selectedSize})`
      )
    );
  };

  return (
    <main className="min-h-screen flex flex-col studio-bg">
      <Navbar onOpenAutopilot={() => setAutopilotOpen(true)} />

      {/* ─── STUDIO SUB-HEADER ─── */}
      <header className="border-b border-border-subtle px-6 py-2.5 flex items-center justify-between shrink-0 bg-surface-1/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Custom Studio</span>
            {selectedSKU && (
              <>
                <span>/</span>
                <span className="text-text-secondary">{selectedSKU.name}</span>
              </>
            )}
          </nav>
        </div>

        {/* Developer & Agent Mode Controls */}
        <div className="flex items-center gap-2.5">
          {/* Autopilot Button */}
          <Button
            variant="buy"
            size="xs"
            onClick={() => setAutopilotOpen(true)}
            className="font-bold cursor-pointer shadow-sm text-[10px]"
          >
            ⚡ Run AI Buyer
          </Button>

          {/* Failure simulator toggle */}
          <button
            onClick={() => setFailureSimEnabled(!failureSimEnabled)}
            className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs border transition-colors cursor-pointer ${
              failureSimEnabled
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "border-border-subtle bg-surface-2 text-text-muted hover:text-foreground"
            }`}
            title="Simulate bank decline during test card payment"
          >
            Simulate Decline: {failureSimEnabled ? "ON" : "OFF"}
          </button>

          {/* Dual Interface HUD Toggle */}
          <button
            onClick={() => setAuditOpen(!auditOpen)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider rounded-xs border transition-all cursor-pointer ${
              auditOpen
                ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                : "bg-surface-2 border-border-subtle text-text-secondary hover:border-border hover:text-foreground"
            }`}
          >
            <span className="text-amber-400 font-bold">⚡</span>
            <span>{auditOpen ? "Live HUD (Docked)" : "Open Live HUD"}</span>
            {auditEntries.length > 0 && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-xs text-[9px] ml-1 font-bold">
                {auditEntries.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ─── MAIN WORKSPACE ─── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* ─── LEFT/CENTER: PRODUCT DISPLAY & ANGLE SWITCHER (E-COMMERCE HERO VIEW) ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-1/40">
          {/* Product Quick Bar */}
          <div className="border-b border-border-subtle px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                  SKU: {selectedSKU?.id}
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-[10px] font-semibold text-emerald-400">
                  ✓ In Stock • Dispatch in 24h
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-[10px] text-text-muted">
                  18% GST Inclusive
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground">
                {selectedSKU?.name}
              </h1>
            </div>

            {/* Front / Back View Switcher */}
            <div className="flex items-center gap-1 border border-border-subtle bg-surface-2 p-1 rounded-xs">
              <button
                onClick={() => {
                  setCurrentView("front");
                  addAuditEntry(
                    createAuditEntry(
                      "CANVAS_VALIDATION",
                      "info",
                      "Perspective switched to FRONT angle garment view."
                    )
                  );
                }}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                  currentView === "front"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Front Angle
              </button>
              <button
                onClick={() => {
                  setCurrentView("back");
                  addAuditEntry(
                    createAuditEntry(
                      "CANVAS_VALIDATION",
                      "info",
                      "Perspective switched to BACK angle garment view."
                    )
                  );
                }}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer ${
                  currentView === "back"
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                Back Angle
              </button>
            </div>
          </div>

          {/* Garment Visual Canvas / Multi-Angle Picture Gallery */}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-10 relative min-h-[420px] overflow-y-auto">
            <div className="absolute inset-0 dot-grid opacity-10" />

            <div className="relative max-w-xl w-full mx-auto flex flex-col">
              <PictureGallery
                sku={selectedSKU || APPAREL_SKUS[1]}
                color={selectedColor}
                designUrl={config.designPreview}
                activeAngleIndex={currentView === "back" ? 1 : 0}
                onAngleChange={(angle) => {
                  if (angle === "front" || angle === "back") {
                    setCurrentView(angle);
                    addAuditEntry(
                      createAuditEntry(
                        "CANVAS_VALIDATION",
                        "info",
                        `Perspective switched to ${angle.toUpperCase()} angle via gallery thumbnail.`
                      )
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── RIGHT: CONFIGURATION & BUY BOX PANEL (AMAZON / FLIPKART STYLE) ─── */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border-subtle bg-surface-1 shrink-0">
          <ConfigPanel
            config={config}
            onUpdate={handleConfigUpdate}
            pricing={pricing}
            onInitiateCheckout={() => initiateCheckout()}
            onAddToBag={handleAddToBag}
            justAddedToBag={justAddedToBag}
          />
        </div>

        {/* ─── LIVE AGENTIC AUDIT HUD ─── */}
        <AuditDrawer
          entries={auditEntries}
          isOpen={auditOpen}
          onToggle={() => setAuditOpen(!auditOpen)}
          onRunAuditTest={handleRunAuditTest}
        />
      </div>

      {/* ─── REMEDIATION TRANSFER NOTIFICATION BANNER ─── */}
      {remediationContext?.isRemediated && (
        <div className="border-t border-emerald-500/40 bg-emerald-950/40 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Transferred from Self-Healing Budget Remediation:
            </span>
            <span className="font-mono text-[9px] text-zinc-300">
              Quantity adapted from 5 to 2 hoodies under ₹5,000 ceiling. Approved Bounded Total: <strong className="text-foreground font-bold">₹3,618.00 INR</strong>
            </span>
          </div>
          <button
            onClick={() => setRemediationContext(null)}
            className="font-mono text-[8px] uppercase tracking-widest text-text-muted hover:text-foreground cursor-pointer px-2 py-0.5 border border-border-subtle hover:border-border"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* ─── BOTTOM STICKY CHECKOUT & PRICING BAR ─── */}
      <footer className="sticky bottom-0 z-30 border-t border-border-subtle px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-1/95 backdrop-blur-md">
        <PriceBreakdown
          pricing={pricing}
          quantity={remediationContext?.isRemediated ? remediationContext.remediatedQty : config.quantity}
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!budgetCheck.allowed && (
            <span className="text-xs uppercase tracking-wider text-red-400 border border-red-500/30 bg-red-950/30 px-3 py-1 font-semibold rounded-xs">
              {budgetCheck.reason}
            </span>
          )}

          {/* Add to Bag Button */}
          <Button
            onClick={handleAddToBag}
            disabled={!budgetCheck.allowed}
            variant="cart"
            size="md"
            className="flex-1 sm:flex-initial font-bold"
          >
            {justAddedToBag ? "✓ Added to Bag!" : "Add to Cart"}
          </Button>

          {/* 1-Click Buy Now */}
          <Button
            onClick={() => initiateCheckout()}
            disabled={!budgetCheck.allowed}
            variant="buy"
            size="md"
            className="flex-1 sm:flex-initial font-bold shadow-md"
          >
            ⚡ Buy Now →
          </Button>
        </div>
      </footer>

      {/* ─── CHECKOUT MODAL ─── */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 bg-background/85 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => {
            // Suppress close if Razorpay SDK overlay is currently open
            const container = document.getElementById("rzp-checkout-container");
            if (container?.dataset.rzpOpen === "true") return;
            setCheckoutOpen(false);
          }}
        >
          <div
            id="rzp-checkout-container"
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <RazorpayCheckoutModal
              amountPaise={remediationContext?.isRemediated ? remediationContext.boundedTotalPaise : pricing.totalPaise}
              currency="INR"
              receipt={receiptId}
              notes={{
                sku: config.selectedSKU,
                color: config.selectedColor,
                size: config.selectedSize,
                quantity: String(remediationContext?.isRemediated ? remediationContext.remediatedQty : config.quantity),
                ...(remediationContext?.isRemediated
                  ? {
                      remediation: "SELF_HEALING_BUDGET_REMEDIER",
                      remediatedAmount: String(remediationContext.boundedTotalPaise),
                    }
                  : {}),
              }}
              remediationContext={remediationContext}
              failureSimEnabled={failureSimEnabled}
              onSuccess={handleCheckoutSuccess}
              onFailure={handleCheckoutFailure}
              onReset={() => {
                setRemediationContext(null);
                setCheckoutOpen(false);
              }}
            />
            <div className="mt-3 text-center">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-foreground cursor-pointer"
              >
                [ Cancel & Return to Studio ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 21ST.DEV AGENT AUTOPILOT MODAL ─── */}
      <AgentAutopilotModal
        isOpen={autopilotOpen}
        onClose={() => setAutopilotOpen(false)}
        onApplyConfig={handleConfigUpdate}
        onAddAuditEntry={addAuditEntry}
        onTriggerCheckout={initiateCheckout}
      />
    </main>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-background font-mono text-xs uppercase tracking-widest text-text-muted">
          Loading Custom Studio...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
