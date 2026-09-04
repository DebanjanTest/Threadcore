"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import type { TransactionRecord } from "@/lib/transactions";

interface DashboardMetrics {
  totalGmvPaise: number;
  totalOrders: number;
  verifiedCount: number;
  failedCount: number;
  pendingCount: number;
  successRatePercent: number;
  idempotencyLockActive: boolean;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      const url = new URL("/api/transactions", window.location.origin);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (sourceFilter !== "ALL") url.searchParams.set("source", sourceFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 0);
    const interval = setInterval(fetchTransactions, 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchTransactions]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateDecline = async () => {
    setSimulating(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulateDecline: true,
          amountPaise: 70682,
        }),
      });
      await fetchTransactions();
    } catch (err) {
      console.error("Failed to simulate decline", err);
    } finally {
      setSimulating(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset transactions to initial test seed state?")) return;
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      await fetchTransactions();
    } catch (err) {
      console.error("Failed to reset", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* ─── HEADER / SUBNAV ─── */}
      <div className="border-b border-border-subtle bg-surface-1/90 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5">
                ● Live Test Monitor
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                Track 01 & Track 03 Evaluator HUD
              </span>
            </div>
            <h1 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
              Razorpay Transaction & Agent Ledger
            </h1>
            <p className="font-mono text-[10px] text-text-secondary mt-1">
              Inspect incoming orders, HMAC verification signatures, idempotency locks, and card decline failover telemetry in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTransactions}
              className="text-xs"
              leftIcon={<span className="text-emerald-400">↻</span>}
            >
              Refresh Feed
            </Button>

            <Button
              variant="glow"
              size="sm"
              loading={simulating}
              onClick={handleSimulateDecline}
              className="text-xs font-bold"
              leftIcon={<span className="text-amber-400">⚡</span>}
            >
              Simulate 1023 Card Decline
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-[10px] text-text-muted hover:text-foreground"
            >
              Reset Seed
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* ─── METRICS CARDS ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border-subtle bg-surface-1 p-4 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
              Total Captured GMV
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-foreground">
                ₹{((metrics?.totalGmvPaise || 0) / 100).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="font-mono text-[8px] text-emerald-400 uppercase">
                Settled
              </span>
            </div>
            <span className="font-mono text-[8px] text-text-muted mt-2 block">
              18% GST itemized & bounded
            </span>
          </div>

          <div className="border border-border-subtle bg-surface-1 p-4 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
              Total Inbound Orders
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-foreground">
                {metrics?.totalOrders ?? 0}
              </span>
              <span className="font-mono text-[8px] text-text-secondary">
                ({metrics?.verifiedCount ?? 0} verified)
              </span>
            </div>
            <span className="font-mono text-[8px] text-text-muted mt-2 block">
              Autonomous AI & Human checkout
            </span>
          </div>

          <div className="border border-border-subtle bg-surface-1 p-4 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
              Verification Success Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-emerald-400">
                {metrics?.successRatePercent ?? 100}%
              </span>
              <span className="font-mono text-[8px] text-text-muted">
                HMAC-SHA256
              </span>
            </div>
            <span className="font-mono text-[8px] text-text-muted mt-2 block">
              {metrics?.failedCount ?? 0} intercepted declines
            </span>
          </div>

          <div className="border border-border-subtle bg-surface-1 p-4 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
              Idempotency Engine
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                ACTIVE & LOCKED
              </span>
            </div>
            <span className="font-mono text-[8px] text-text-muted mt-2 block">
              Zero duplicate charges guaranteed
            </span>
          </div>
        </div>

        {/* ─── CONTROLS & FILTER TABS ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="flex flex-wrap items-center gap-1 bg-surface-2 p-1 border border-border-subtle">
            {(["ALL", "VERIFIED", "FAILED", "PENDING"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  statusFilter === status
                    ? "bg-foreground text-background font-bold"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-surface-2 p-1 border border-border-subtle">
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted px-2">
              Source:
            </span>
            {(["ALL", "AGENT_CLI", "AGENT_AUTOPILOT", "HUMAN_WEB", "SIMULATOR"] as const).map(
              (src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={`px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider transition-colors ${
                    sourceFilter === src
                      ? "bg-foreground text-background font-bold"
                      : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {src.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* ─── TRANSACTIONS TABLE ─── */}
        <div className="border border-border-subtle bg-surface-1 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-border-subtle bg-surface-2/60 text-[9px] uppercase tracking-widest text-text-muted">
                <tr>
                  <th className="py-3 px-4">Order ID / Receipt</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">SKU / Notes</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Idempotency Key</th>
                  <th className="py-3 px-4 text-right">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-text-muted">
                      Loading telemetry records...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-text-muted">
                      No transaction records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isVerified = tx.status === "VERIFIED";
                    const isFailed = tx.status === "FAILED";

                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-surface-2/50 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-[11px]">
                              {tx.id}
                            </span>
                            <button
                              onClick={() => handleCopy(tx.id, tx.id)}
                              title="Copy Order ID"
                              className="text-text-muted hover:text-foreground text-[9px]"
                            >
                              {copiedId === tx.id ? "✓" : "📋"}
                            </button>
                          </div>
                          <span className="font-mono text-[8px] text-text-muted block mt-0.5">
                            {tx.receipt}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-text-secondary text-[10px]" suppressHydrationWarning>
                          <div suppressHydrationWarning>
                            {new Date(tx.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                          <span className="text-[8px] text-text-muted" suppressHydrationWarning>
                            {new Date(tx.createdAt).toISOString().split("T")[0]}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-text-secondary text-[11px]">
                          <div className="font-semibold text-foreground">
                            {tx.notes?.sku || "TC-APPAREL"}
                          </div>
                          <div className="text-[9px] text-text-muted flex gap-2">
                            {tx.notes?.size && <span>Size: {tx.notes.size}</span>}
                            {tx.notes?.color && <span>• {tx.notes.color}</span>}
                            {tx.notes?.quantity && <span>• Qty: {tx.notes.quantity}</span>}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-foreground">
                            ₹{(tx.amountPaise / 100).toFixed(2)}
                          </span>
                          <span className="block text-[8px] text-text-muted uppercase">
                            {tx.currency}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-wider font-bold border ${
                              tx.source.startsWith("AGENT")
                                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                                : tx.source === "SIMULATOR"
                                ? "bg-amber-950/40 border-amber-500/30 text-amber-400"
                                : "bg-surface-3 border-border text-text-primary"
                            }`}
                          >
                            {tx.source}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isVerified
                                  ? "bg-emerald-400"
                                  : isFailed
                                  ? "bg-red-500 animate-pulse"
                                  : "bg-amber-400"
                              }`}
                            />
                            <span
                              className={`text-[9px] uppercase tracking-wider font-bold ${
                                isVerified
                                  ? "text-emerald-400"
                                  : isFailed
                                  ? "text-red-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                          {tx.failureReason && (
                            <span className="text-[8px] text-red-400/80 block mt-0.5 truncate max-w-xs">
                              {tx.failureReason}
                            </span>
                          )}
                          {tx.recoveryStatus === "RECOVERED" && (
                            <span className="text-[8px] text-emerald-400 font-bold block mt-0.5">
                              ✓ Auto UPI Recovered
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-text-muted text-[10px]">
                          <span className="truncate block max-w-[140px]" title={tx.idempotencyKey}>
                            {tx.idempotencyKey}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setSelectedTx(tx)}
                            className="font-mono text-[9px]"
                          >
                            Inspect ↗
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── TRACK 01 & 03 ARCHITECTURE HIGHLIGHT ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border-subtle bg-surface-1 p-5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">
              Track 01 • Agentic Commerce Gateway
            </h3>
            <p className="font-mono text-[10px] text-text-secondary leading-relaxed mb-3">
              Machine buyers invoke <code className="text-foreground">POST /api/agent/evaluate</code> with bounding box parameters and budget limits (₹5,000 ceiling). Upon validation, order parameters flow directly into <code className="text-foreground">/api/razorpay/create-order</code> with cryptographic idempotency locking.
            </p>
            <div className="flex gap-2">
              <Link href="/api/agent/catalog" target="_blank">
                <Button variant="outline" size="xs">
                  View Catalog JSON ↗
                </Button>
              </Link>
              <Link href="/api/agent/protocol" target="_blank">
                <Button variant="ghost" size="xs">
                  UAP Discovery Manifest ↗
                </Button>
              </Link>
            </div>
          </div>

          <div className="border border-border-subtle bg-surface-1 p-5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
              Track 03 • &apos;The Bar&apos; Revenue Recovery Agent
            </h3>
            <p className="font-mono text-[10px] text-text-secondary leading-relaxed mb-3">
              When test card <code className="text-foreground font-bold">4000 0000 0000 1023</code> triggers an issuer decline, the idempotency lock freezes duplicate attempts, logs root cause telemetry, and triggers an autonomous UPI failover to recover the sale.
            </p>
            <Button
              variant="glow"
              size="xs"
              onClick={handleSimulateDecline}
              leftIcon={<span className="text-amber-400">⚡</span>}
            >
              Trigger Test Card Decline
            </Button>
          </div>
        </div>
      </div>

      {/* ─── RAW JSON PAYLOAD INSPECTOR MODAL ─── */}
      {selectedTx && (
        <div
          className="fixed inset-0 bg-background/85 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="w-full max-w-2xl bg-surface-1 border border-border shadow-2xl p-6 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                  Order Telemetry Payload: {selectedTx.id}
                </span>
                <span
                  className={`text-[8px] uppercase tracking-wider px-2 py-0.5 border font-bold ${
                    selectedTx.status === "VERIFIED"
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                      : selectedTx.status === "FAILED"
                      ? "bg-red-950/40 border-red-500/30 text-red-400"
                      : "bg-amber-950/40 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {selectedTx.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-text-muted hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-surface-2 p-4 border border-border-subtle font-mono text-[10px] text-zinc-300">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(selectedTx, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[9px] text-text-muted">
                Idempotency: {selectedTx.idempotencyKey}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTx(null)}
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
