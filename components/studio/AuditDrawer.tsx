"use client";

import { useState, useEffect, useRef } from "react";
import type { AuditEntry } from "@/lib/types";

interface AuditDrawerProps {
  entries: AuditEntry[];
  isOpen: boolean;
  onToggle: () => void;
  onRunAuditTest?: (testType: "BOUND_CHECK" | "SCHEMA_FETCH" | "FAIL_SIM") => void;
}

const stepCategoryLabels: Record<string, string> = {
  SCHEMA_FETCH: "GARMENT SPEC",
  CANVAS_VALIDATION: "CANVAS / ARTWORK",
  BOUND_CHECK: "FINANCIAL BOUNDS",
  RZP_ORDER_CREATE: "RAZORPAY ORDER",
  PAYMENT_VERIFY: "PAYMENT CAPTURED",
  PAYMENT_FAILED: "PAYMENT DECLINE",
  AGENT_EVALUATE: "AGENT DECISION",
  CHECKOUT_INIT: "CHECKOUT INITIATED",
};

const statusBadges: Record<string, { bg: string; text: string }> = {
  success: { bg: "bg-emerald-900/30 border-emerald-500/30 text-emerald-400", text: "VERIFIED" },
  error: { bg: "bg-red-900/30 border-red-500/30 text-red-400", text: "GATE DECLINED" },
  pending: { bg: "bg-amber-900/30 border-amber-500/30 text-amber-400", text: "ACTIVE" },
  info: { bg: "bg-surface-3 border-border text-zinc-300", text: "RECORDED" },
};

export default function AuditDrawer({
  entries,
  isOpen,
  onToggle,
  onRunAuditTest,
}: AuditDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"ALL" | "PRICING" | "PRODUCT" | "ARTWORK" | "PAYMENTS">("ALL");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const filteredEntries = entries.filter((e) => {
    if (filter === "ALL") return true;
    if (filter === "PRICING") return e.step === "BOUND_CHECK" || e.message.toLowerCase().includes("price") || e.message.toLowerCase().includes("ceiling") || e.message.toLowerCase().includes("gst");
    if (filter === "PRODUCT") return e.step === "SCHEMA_FETCH" || e.message.toLowerCase().includes("garment") || e.message.toLowerCase().includes("size") || e.message.toLowerCase().includes("color");
    if (filter === "ARTWORK") return e.step === "CANVAS_VALIDATION" || e.message.toLowerCase().includes("artwork") || e.message.toLowerCase().includes("dpi");
    if (filter === "PAYMENTS") return e.step.includes("RZP") || e.step.includes("PAYMENT") || e.step === "CHECKOUT_INIT";
    return true;
  });

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(entries, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="Live Agent Recorded HUD"
      className={`
        border-l border-border-subtle bg-surface-1/95 backdrop-blur-md
        transition-all duration-300 flex flex-col shrink-0 z-20 shadow-xl
        ${isOpen ? "w-full sm:w-96 lg:w-[420px]" : "w-10"}
      `}
    >
      {/* ─── TITLE & CONTROL BAR ─── */}
      <div className="h-12 flex items-center justify-between border-b border-border-subtle px-3 bg-surface-2 shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 hover:text-foreground text-text-secondary font-mono text-[11px] uppercase tracking-wider cursor-pointer p-1"
          title={isOpen ? "Collapse HUD" : "Open Live Agent Recorded HUD"}
        >
          <span className="font-bold text-amber-400">{isOpen ? "▶" : "◀"}</span>
          {isOpen && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Live Agent Recorded HUD</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {entries.length}
              </span>
            </div>
          )}
        </button>

        {isOpen && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLogs}
              title="Copy telemetry log stream as JSON"
              className="font-mono text-[9px] uppercase tracking-wider text-text-muted hover:text-foreground px-2 py-1 rounded-xs border border-border-subtle bg-surface-1 cursor-pointer transition-colors"
            >
              {copied ? "Copied ✓" : "Copy JSON"}
            </button>
            <button
              onClick={onToggle}
              title="Close HUD"
              className="text-text-muted hover:text-foreground font-mono text-xs px-1.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sub-bar with explanation & filters */}
          <div className="px-3 py-2.5 border-b border-border-subtle bg-surface-2/40 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between text-[9px] font-mono text-text-muted uppercase tracking-wider">
              <span>Agentic Commerce Telemetry</span>
              <span>Ceiling: ₹5,000 INR</span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1">
              {(["ALL", "PRODUCT", "PRICING", "ARTWORK", "PAYMENTS"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                    filter === f
                      ? "bg-foreground text-background font-bold border-foreground shadow-xs"
                      : "bg-surface-2 border-border-subtle text-text-muted hover:text-foreground hover:bg-surface-3"
                  }`}
                >
                  {f}
                </button>
              ))}

              {onRunAuditTest && (
                <button
                  onClick={() => onRunAuditTest("BOUND_CHECK")}
                  className="ml-auto px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-xs border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                >
                  + Bound Test
                </button>
              )}
            </div>
          </div>

          {/* Stream Log Container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 font-mono text-xs select-text"
          >
            {filteredEntries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-subtle my-auto rounded-sm">
                <span className="text-xl mb-2">⚡</span>
                <span className="font-mono text-xs uppercase tracking-wider text-text-secondary font-bold">
                  Telemetry Standby
                </span>
                <p className="font-mono text-[10px] text-text-muted max-w-[260px] mt-1 leading-relaxed">
                  Every product change (silhouette, sizing, color, print artwork, live pricing) stamps an explainable audit record here in real time.
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const time = new Date(entry.timestamp);
                const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;
                const badge = statusBadges[entry.status] || statusBadges.info;
                const category = stepCategoryLabels[entry.step] || entry.step;

                return (
                  <div
                    key={entry.id}
                    className="border border-border-subtle bg-surface-2 rounded-sm p-3 shadow-xs transition-all hover:border-border flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-xs border font-bold ${badge.bg}`}
                        >
                          {badge.text}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-amber-400">
                          {category}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-text-muted" suppressHydrationWarning>
                        {timeStr}
                      </span>
                    </div>

                    <p className="font-mono text-[10px] text-zinc-200 leading-relaxed break-words">
                      {entry.message}
                    </p>

                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                      <div className="border border-border-subtle bg-surface-1/90 rounded-xs p-2 mt-1">
                        <span className="text-[8px] uppercase text-text-muted font-bold block mb-1">
                          Metadata Snapshot:
                        </span>
                        <pre className="text-[9px] text-text-secondary overflow-x-auto whitespace-pre leading-snug">
                          {JSON.stringify(entry.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-2.5 border-t border-border-subtle bg-surface-2 flex items-center justify-between text-[9px] font-mono text-text-muted">
            <span>NPCI UAP • Razorpay API Verified</span>
            <span>{filteredEntries.length} Recorded</span>
          </div>
        </div>
      )}
    </aside>
  );
}
