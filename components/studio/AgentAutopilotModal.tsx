"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import type { StudioConfig, AuditEntry, RemediationContext } from "@/lib/types";
import { createAuditEntry } from "@/lib/guardrails";

interface AgentAutopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: Partial<StudioConfig>) => void;
  onAddAuditEntry: (entry: AuditEntry) => void;
  onTriggerCheckout: (remediation?: RemediationContext) => void;
}

type AutopilotPersona = "budget_shopper" | "overflow_healer" | "recovery_tester";

interface PersonaConfig {
  id: AutopilotPersona;
  title: string;
  tagline: string;
  budgetPaise: number;
  badge: string;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: "budget_shopper",
    title: "1. Autonomous Direct Buyer",
    tagline: "Fetches UAP catalog, checks printability, orders Heavyweight Tee under ₹2,500.",
    budgetPaise: 250000,
    badge: "HAPPY PATH",
  },
  {
    id: "overflow_healer",
    title: "2. Self-Healing Budget Recovery",
    tagline: "Attempts 5 Technical Hoodies (> ₹7,500), hits ₹5,000 ceiling, auto-remediates to fit.",
    budgetPaise: 500000,
    badge: "BOUNDS & GATING",
  },
  {
    id: "recovery_tester",
    title: "3. Revenue Recovery Failover",
    tagline: "Simulates issuing bank card decline (4000000000001023) and recovers order via UPI.",
    budgetPaise: 350000,
    badge: "TRACK 03 RECOVERY",
  },
];

interface LogLine {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warn" | "error" | "action";
  text: string;
}

export default function AgentAutopilotModal({
  isOpen,
  onClose,
  onApplyConfig,
  onAddAuditEntry,
  onTriggerCheckout,
}: AgentAutopilotModalProps) {
  const [selectedPersona, setSelectedPersona] = useState<AutopilotPersona>("budget_shopper");
  const [isRunning, setIsRunning] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const appendLog = (type: LogLine["type"], text: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, timestamp: time, type, text }]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    setProgressStep(1);

    appendLog("info", "▶ INITIALIZING UAP AUTONOMOUS AGENT RUNTIME...");
    await sleep(400);

    // Step 1: Protocol discovery
    appendLog("action", "GET /.well-known/agentic-commerce.json (Discovering Merchant Protocol)");
    await sleep(500);
    appendLog("success", "✓ Protocol Handshake: UAP/1.0, ACP/1.0. Hard ceiling: ₹5,000 INR.");
    onAddAuditEntry(createAuditEntry("SCHEMA_FETCH", "success", "Agent protocol discovery initiated"));

    setProgressStep(2);
    await sleep(500);

    // Step 2: Catalog Evaluation
    appendLog("action", "GET /api/agent/catalog (Fetching machine-readable SKUs & print matrices)");
    await sleep(600);

    if (selectedPersona === "budget_shopper") {
      appendLog("info", "Agent Goal: Acquire street-grade tee within ₹2,500 total budget.");
      appendLog("info", "Selecting SKU: TC-TEE-001 (Heavyweight Tee 220 GSM)");
      onApplyConfig({
        selectedSKU: "TC-TEE-001",
        selectedColor: "black",
        selectedSize: "L",
        printLocations: ["front-center"],
        printTechnique: "dtg",
        quantity: 1,
      });

      setProgressStep(3);
      await sleep(600);
      appendLog("action", "POST /api/agent/evaluate (Checking print canvas & DPI tolerance)");
      await sleep(700);
      appendLog("success", "✓ DPI Check: 2000x2000px on 280x350mm canvas exceeds 300 DPI threshold.");
      appendLog("success", "✓ Line-item Pricing: Garment ₹599 + Surface Markup ₹90 + 18% GST ₹124 = ₹813 Total.");
      appendLog("success", "✓ Gating Gate Passed: ₹813 is well below ₹5,000 ceiling.");
      onAddAuditEntry(createAuditEntry("CANVAS_VALIDATION", "success", "Agent verified printability & budget ₹813"));

      setProgressStep(4);
      await sleep(600);
      appendLog("action", "POST /api/razorpay/create-order (Requesting bounded test order)");
      await sleep(800);
      const mockOrderId = `order_agent_${Date.now()}`;
      appendLog("success", `✓ Razorpay Order Created: ${mockOrderId} [₹813.00 INR]`);
      onAddAuditEntry(createAuditEntry("RZP_ORDER_CREATE", "success", `Autonomous Agent order created: ${mockOrderId}`));

      setProgressStep(5);
      appendLog("info", "⚡ Handing off to Razorpay Checkout Modal for Instant Settlement...");
      await sleep(800);
      setIsRunning(false);
      onClose();
      onTriggerCheckout();

    } else if (selectedPersona === "overflow_healer") {
      appendLog("warn", "Agent Goal: Large bulk team drop. Desired: 5× Technical Hoodies + Front print.");
      onApplyConfig({
        selectedSKU: "TC-HOD-001",
        selectedColor: "charcoal",
        selectedSize: "XL",
        printLocations: ["front-center"],
        printTechnique: "dtg",
        quantity: 5,
      });

      setProgressStep(3);
      await sleep(600);
      appendLog("action", "POST /api/agent/evaluate (Attempting 5× Hoodies = ₹9,045 Total)");
      await sleep(700);
      appendLog("error", "✕ GATE REJECTION: ₹9,045 exceeds non-bypassable ceiling of ₹5,000 (HTTP 403 / Bound Check).");
      onAddAuditEntry(createAuditEntry("BOUND_CHECK", "error", "Ceiling violation: ₹9,045 > ₹5,000"));

      await sleep(600);
      appendLog("warn", "⚡ SELF-HEALING REMEDIATOR ACTIVATED: Analyzing catalog alternatives under bounds...");
      await sleep(800);
      appendLog("success", "✓ Remediation Proposal: Adapt quantity from 5 to 2× Hoodies -> ₹3,618 Total.");
      
      onApplyConfig({
        selectedSKU: "TC-HOD-001",
        selectedColor: "charcoal",
        selectedSize: "XL",
        printLocations: ["front-center"],
        quantity: 2,
      });
      appendLog("action", "POST /api/agent/evaluate (Re-submitting adapted order under ₹5,000 ceiling)");
      await sleep(700);
      appendLog("success", "✓ Bounds verified: ₹3,618 within ₹5,000 ceiling. Audit entry stamped.");
      onAddAuditEntry(createAuditEntry("BOUND_CHECK", "success", "Remediated order approved: ₹3,618"));

      setProgressStep(4);
      await sleep(600);
      appendLog("action", "POST /api/razorpay/create-order (Generating Razorpay order)");
      await sleep(800);
      appendLog("success", `✓ Razorpay Order Created: order_remediated_${Date.now()} [₹3,618.00 INR]`);

      setProgressStep(5);
      appendLog("info", "⚡ Transferred from Self-Healing Budget Remediation: Launching Bounded Checkout...");
      await sleep(800);
      setIsRunning(false);
      onClose();
      onTriggerCheckout({
        isRemediated: true,
        source: "SELF_HEALING_BUDGET_REMEDIER",
        title: "Transferred from Self-Healing Budget Remediation",
        originalQty: 5,
        remediatedQty: 2,
        originalTotalPaise: 904500,
        boundedTotalPaise: 361800,
        savingsPaise: 542700,
        reason: "Quantity adapted from 5 to 2 hoodies under ₹5,000 ceiling",
      });

    } else if (selectedPersona === "recovery_tester") {
      appendLog("info", "Agent Goal: Test payment rail resilience and Track 03 failure recovery.");
      appendLog("info", "Selecting SKU: TC-JER-001 (Performance Jersey)");
      onApplyConfig({
        selectedSKU: "TC-JER-001",
        selectedColor: "off-black",
        selectedSize: "M",
        printLocations: ["front-center"],
        printTechnique: "sublimation",
        quantity: 1,
      });

      setProgressStep(3);
      await sleep(600);
      appendLog("action", "POST /api/agent/evaluate -> Evaluated ₹1,079 INR. Gating passed.");
      onAddAuditEntry(createAuditEntry("CANVAS_VALIDATION", "success", "SKU TC-JER-001 validated"));

      setProgressStep(4);
      await sleep(600);
      appendLog("action", "POST /api/razorpay/create-order -> Order generated.");
      appendLog("warn", "Simulating bank decline test card: 4000000000001023 (CARD_DECLINED_BY_ISSUER)");
      onAddAuditEntry(createAuditEntry("PAYMENT_FAILED", "error", "Simulated card decline on 4000000000001023"));

      setProgressStep(5);
      appendLog("success", "✓ Graceful Failure Handled: Triggering Track 03 Revenue Recovery failover!");
      await sleep(800);
      setIsRunning(false);
      onClose();
      onTriggerCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="w-full max-w-2xl bg-surface-1 border border-border-subtle shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-border-subtle bg-surface-2/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-foreground font-bold">
              Autonomous AI Buyer Engine • NPCI UAP Runtime
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="text-text-muted hover:text-foreground font-mono text-sm px-2 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Persona Selector Tabs */}
        <div className="p-4 border-b border-border-subtle bg-surface-1">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted block mb-2.5">
            Select Buyer Agent Persona to Simulate:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                disabled={isRunning}
                onClick={() => setSelectedPersona(p.id)}
                className={`
                  p-3 border text-left transition-all flex flex-col justify-between
                  ${
                    selectedPersona === p.id
                      ? "border-amber-500/60 bg-amber-500/10 shadow-xs"
                      : "border-border-subtle bg-surface-2 hover:border-border hover:bg-surface-3"
                  }
                  disabled:opacity-50
                `}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-foreground truncate">
                      {p.title}
                    </span>
                  </div>
                  <span className="font-mono text-[8px] text-text-muted leading-tight block mb-2">
                    {p.tagline}
                  </span>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-wider text-amber-400 border border-amber-500/30 px-1.5 py-0.5 w-fit">
                  {p.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Terminal Stream */}
        <div className="p-4 bg-[#0a0a0c] flex-1 flex flex-col min-h-[220px] max-h-[260px]">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2 font-mono text-[8px] uppercase tracking-widest text-text-muted">
            <span className="flex items-center gap-2">
              <span>Agent Telemetry Output</span>
              {progressStep > 0 && (
                <span className="text-emerald-400 font-bold border border-emerald-500/20 bg-emerald-950/40 px-1.5 py-0.2">
                  Phase {progressStep}/5
                </span>
              )}
            </span>
            <span className="text-emerald-400">
              {isRunning ? "● EXECUTION ACTIVE" : "○ READY FOR TRIGGER"}
            </span>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] pr-1"
          >
            {logs.length === 0 ? (
              <div className="text-text-muted text-center py-8">
                Click &quot;Run Autonomous Agent&quot; to begin end-to-end UAP transaction sequence.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-tight">
                  <span className="text-text-muted text-[8px] shrink-0 pt-0.5">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={
                      log.type === "success"
                        ? "text-emerald-400 font-semibold"
                        : log.type === "error"
                        ? "text-red-400 font-semibold"
                        : log.type === "warn"
                        ? "text-amber-400"
                        : log.type === "action"
                        ? "text-cyan-400"
                        : "text-zinc-300"
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-border-subtle bg-surface-2 flex items-center justify-between gap-3">
          <div className="font-mono text-[9px] text-text-muted">
            <span>Standard: NPCI UAP • Razorpay API</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isRunning}
            >
              Cancel
            </Button>

            <Button
              variant="buy"
              size="sm"
              loading={isRunning}
              onClick={runSimulation}
            >
              {isRunning ? "Agent Reasoning..." : "⚡ Run Autonomous Agent"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
