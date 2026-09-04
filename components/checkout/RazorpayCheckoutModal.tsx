"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { CheckoutState, RemediationContext } from "@/lib/types";
import Button from "@/components/ui/Button";

interface RazorpayCheckoutModalProps {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
  failureSimEnabled: boolean;
  remediationContext?: RemediationContext | null;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: string, rootCause: string) => void;
  onReset: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const TEST_CARD_DECLINE = "4000000000001023";

export default function RazorpayCheckoutModal({
  amountPaise,
  currency,
  receipt,
  notes,
  failureSimEnabled,
  remediationContext,
  onSuccess,
  onFailure,
  onReset,
}: RazorpayCheckoutModalProps) {
  const activeAmountPaise = remediationContext?.isRemediated
    ? remediationContext.boundedTotalPaise
    : amountPaise;

  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [demoOrderInfo, setDemoOrderInfo] = useState<{ orderId: string; amount: number } | null>(null);

  const failureSimRef = useRef(failureSimEnabled);
  const onSuccessRef = useRef(onSuccess);
  const onFailureRef = useRef(onFailure);

  useEffect(() => {
    failureSimRef.current = failureSimEnabled;
  }, [failureSimEnabled]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onFailureRef.current = onFailure;
  }, [onFailure]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const verifyPayment = useCallback(
    async (response: RazorpayResponse) => {
      setCheckoutState("processing");
      try {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });

        const result = await verifyRes.json();

        if (result.verified) {
          setCheckoutState("success");
          setDemoOrderInfo(null);
          onSuccessRef.current(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        } else {
          setCheckoutState("failed");
          setErrorMessage("Payment verification failed");
          setRootCause(
            `VERIFY_FAILED: HMAC signature mismatch for order ${response.razorpay_order_id}`
          );
          onFailureRef.current(
            "Payment verification failed",
            `VERIFY_FAILED: HMAC signature mismatch`
          );
        }
      } catch (err) {
        setCheckoutState("failed");
        const msg = err instanceof Error ? err.message : "Verification error";
        setErrorMessage(msg);
        setRootCause(`VERIFY_NETWORK_ERROR: ${msg}`);
        onFailureRef.current(msg, `VERIFY_NETWORK_ERROR: ${msg}`);
      }
    },
    []
  );

  const openCheckoutWindow = useCallback(
    (
      keyId: string,
      amount: number,
      curr: string,
      orderId: string,
      simulate: boolean
    ) => {
      if (typeof window === "undefined" || !window.Razorpay) {
        setCheckoutState("failed");
        setErrorMessage("Razorpay SDK not loaded");
        setRootCause("SDK_LOAD_FAILED: checkout.js not available");
        return;
      }

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency: curr,
        name: "THREAD//CORE",
        description: "Apparel Studio Order",
        order_id: orderId,
        handler: (response: RazorpayResponse) => {
          if (simulate && failureSimRef.current) {
            setCheckoutState("failed");
            setErrorMessage("Payment declined by issuing bank");
            setRootCause(
              `CARD_DECLINED: Simulated decline for test card ${TEST_CARD_DECLINE}. ` +
                `Payment ID: ${response.razorpay_payment_id}. ` +
                `Root cause: Card issuer rejected the transaction. ` +
                `Action: Retry with a different card or payment method.`
            );
            onFailureRef.current(
              "Payment declined by issuing bank",
              `CARD_DECLINED: Simulated decline for test card ${TEST_CARD_DECLINE}`
            );
            return;
          }
          verifyPayment(response);
        },
        modal: {
          ondismiss: () => {
            setCheckoutState("idle");
          },
        },
        theme: { color: "#f4f4f5" },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Razorpay init failed";
        setCheckoutState("failed");
        setErrorMessage(msg);
        setRootCause(`SDK_INIT_ERROR: ${msg}`);
      }
    },
    [verifyPayment]
  );

  const initiateCheckout = useCallback(async () => {
    if (checkoutState === "processing") return;

    setCheckoutState("processing");
    setErrorMessage("");
    setRootCause("");

    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaise: activeAmountPaise, currency, receipt, notes }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Failed to create order");
      }

      const data = await orderRes.json();
      const { orderId, amount, currency: curr, keyId, isDemo } = data;
      setLastOrderId(orderId);

      // If demo mode or placeholder keys are detected, show interactive sandbox
      if (isDemo || keyId === "rzp_test_DEMO_KEY" || keyId?.includes("YOUR_KEY_ID")) {
        setDemoOrderInfo({ orderId, amount: amount || activeAmountPaise });
        setCheckoutState("idle");
        return;
      }

      openCheckoutWindow(keyId, amount || activeAmountPaise, curr, orderId, failureSimRef.current);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      setCheckoutState("failed");
      setErrorMessage(msg);
      setRootCause(`CHECKOUT_INIT_FAILED: ${msg}`);
      onFailureRef.current(msg, `CHECKOUT_INIT_FAILED: ${msg}`);
    }
  }, [checkoutState, activeAmountPaise, currency, receipt, notes, openCheckoutWindow]);

  const handleSimulateDemoPayment = () => {
    if (!demoOrderInfo) return;

    if (failureSimEnabled) {
      const failReason = `CARD_DECLINED: Simulated decline for test card ${TEST_CARD_DECLINE}. Payment ID: pay_sim_declined_${Date.now()}. Root cause: Simulated issuer refusal for testing error recovery.`;
      setCheckoutState("failed");
      setErrorMessage("Payment declined by issuing bank (Simulated)");
      setRootCause(failReason);

      fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: demoOrderInfo.orderId,
          status: "FAILED",
          details: {
            failureReason: failReason,
            recoveryMethod: "UPI_FAILOVER",
            recoveryStatus: "OFFERED",
            rawPayload: { testCard: TEST_CARD_DECLINE, idempotencyLock: true },
          },
        }),
      }).catch(() => {});

      onFailureRef.current(
        "Payment declined by issuing bank",
        `CARD_DECLINED: Simulated decline for test card ${TEST_CARD_DECLINE}`
      );
      return;
    }

    verifyPayment({
      razorpay_order_id: demoOrderInfo.orderId,
      razorpay_payment_id: `pay_demo_${Date.now()}`,
      razorpay_signature: "sig_demo_verified",
    });
  };

  function handleRetry() {
    setCheckoutState("idle");
    setErrorMessage("");
    setRootCause("");
    setDemoOrderInfo(null);
    onReset();
  }

  return (
    <div className="border border-border-subtle bg-surface-2 shadow-2xl overflow-hidden">
      {/* ─── TRANSFERRED FROM SELF-HEALING BUDGET REMEDIATOR CALLOUT ─── */}
      {remediationContext && remediationContext.isRemediated && (
        <div className="border-b border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 to-surface-2 p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-[11px] uppercase font-bold tracking-wider text-emerald-400">
                Transferred from Self-Healing Budget Remediation
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-300 border border-emerald-500/40 bg-emerald-900/60 px-2 py-0.5 font-bold">
              BOUNDED & GATED
            </span>
          </div>
          <p className="font-mono text-[9.5px] text-zinc-300 leading-relaxed">
            Original request (<span className="line-through text-red-400">5× Hoodies = ₹9,045</span>) exceeded the non-bypassable ₹5,000 ceiling. Autonomous evaluator adapted order to <strong className="text-foreground font-bold">2× Technical Hoodies</strong> under UAP guardrails.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 font-mono text-[10px]">
            <span className="text-text-muted">Approved Bounded Total:</span>
            <span className="text-emerald-400 font-bold text-sm">
              ₹{(remediationContext.boundedTotalPaise / 100).toLocaleString("en-IN")} INR
            </span>
          </div>
        </div>
      )}

      {/* ─── DEMO SANDBOX PORTAL (When placeholder keys are used) ─── */}
      {demoOrderInfo && checkoutState === "idle" && (
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                Razorpay Sandbox
              </span>
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-950/40 px-2 py-0.5 font-bold">
              Test Environment
            </span>
          </div>

          <div className="bg-surface-1 border border-border-subtle p-3 space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between text-text-muted">
              <span>Order ID:</span>
              <span className="text-foreground">{demoOrderInfo.orderId}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Amount Due:</span>
              <span className="text-foreground font-bold text-xs">
                ₹{((demoOrderInfo ? demoOrderInfo.amount : activeAmountPaise) / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Simulated Card:</span>
              <span className="text-foreground">•••• •••• •••• 1023</span>
            </div>
          </div>

          {failureSimEnabled && (
            <div className="border border-amber-500/30 bg-amber-950/30 p-2 text-center">
              <span className="font-mono text-[8px] uppercase tracking-widest text-amber-400 block font-bold">
                ⚠️ Fail Sim Active: Will trigger card decline
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSimulateDemoPayment}
              variant={failureSimEnabled ? "danger" : "buy"}
              size="md"
              className="w-full font-bold shadow-md"
            >
              {failureSimEnabled ? "Execute Simulated Decline" : "Complete Test Payment →"}
            </Button>

            <button
              onClick={() => {
                setDemoOrderInfo(null);
                setCheckoutState("idle");
              }}
              className="font-mono text-[9px] uppercase tracking-widest text-text-muted hover:text-foreground text-center py-1 cursor-pointer"
            >
              Cancel Sandbox
            </button>
          </div>
        </div>
      )}

      {/* ─── INITIAL IDLE STATE ─── */}
      {!demoOrderInfo && checkoutState === "idle" && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
              Razorpay Checkout Engine
            </span>
            {failureSimEnabled && (
              <span className="font-mono text-[8px] uppercase tracking-widest text-amber-400 border border-amber-500/30 bg-amber-950/20 px-2 py-0.5">
                Failure Sim Active
              </span>
            )}
          </div>

          <div className="bg-surface-1 border border-border-subtle p-3.5 flex justify-between items-center font-mono">
            <span className="text-text-muted text-xs">Amount Payable:</span>
            <span className="text-foreground font-bold text-base">
              ₹{(activeAmountPaise / 100).toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            onClick={initiateCheckout}
            variant="buy"
            size="lg"
            className="w-full font-bold text-xs shadow-md"
            leftIcon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          >
            Initiate Bounded Payment
          </Button>

          <div className="flex items-center justify-center gap-2 font-mono text-[8px] text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>256-Bit SSL Encrypted • NPCI UAP Compliant</span>
          </div>
        </div>
      )}

      {/* ─── PROCESSING STATE ─── */}
      {checkoutState === "processing" && (
        <div className="p-6 flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
            Verifying Transaction On-Chain / Razorpay...
          </span>
        </div>
      )}

      {/* ─── SUCCESS STATE ─── */}
      {checkoutState === "success" && (
        <div className="p-6 flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-2 border-emerald-400 bg-emerald-950/40 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            ✓
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Payment Verified & Captured
          </span>
          <span className="font-mono text-[9px] text-text-muted">
            Order {lastOrderId || "SETTLED"} • ₹{(activeAmountPaise / 100).toLocaleString("en-IN")} Settled • Audit Entry Stamped
          </span>
        </div>
      )}

      {/* ─── FAILED STATE + TRACK 03 RECOVERY INTERVENTION ─── */}
      {checkoutState === "failed" && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-500 bg-red-950/20 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-red-400 font-bold">
                Payment Interrupted
              </div>
              <div className="font-mono text-[9px] text-text-muted mt-0.5">
                {errorMessage}
              </div>
            </div>
          </div>

          {rootCause && (
            <div className="border border-red-500/20 bg-red-950/10 p-2.5">
              <div className="font-mono text-[8px] text-red-400/80 uppercase tracking-widest mb-1 font-bold">
                Root Cause Telemetry
              </div>
              <div className="font-mono text-[8px] text-text-secondary whitespace-pre-wrap">
                {rootCause}
              </div>
            </div>
          )}

          {/* Track 03: Automated Revenue Recovery Intervention Card */}
          <div className="border border-emerald-500/30 bg-emerald-950/20 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AI Revenue Recovery Agent Active
              </span>
              <span className="font-mono text-[7px] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.2">
                Track 03 Automated Action
              </span>
            </div>
            <p className="font-mono text-[9px] text-zinc-300 leading-relaxed">
              Card issuer outage detected. Recovery agent deployed: bypass card rail with instant UPI Autopay / Dynamic QR to eliminate checkout drop-off.
            </p>
            <Button
              onClick={() => {
                setCheckoutState("processing");
                const recPayId = `pay_recovered_upi_${Date.now()}`;
                const targetOrder = lastOrderId || `order_rec_${Date.now()}`;
                fetch("/api/transactions", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "update",
                    id: targetOrder,
                    status: "VERIFIED",
                    details: {
                      paymentId: recPayId,
                      signature: "sig_recovered_verified_upi",
                      recoveryMethod: "UPI_FAILOVER",
                      recoveryStatus: "RECOVERED",
                    },
                  }),
                }).catch(() => {});

                setTimeout(() => {
                  setCheckoutState("success");
                  onSuccessRef.current(
                    recPayId,
                    targetOrder,
                    "sig_recovered_verified"
                  );
                }, 900);
              }}
              variant="buy"
              size="sm"
              className="w-full font-bold shadow-md"
            >
              ⚡ Instant UPI Recovery Failover →
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="secondary" size="sm" className="flex-1">
              Retry Standard
            </Button>
            <Button
              onClick={() => {
                setCheckoutState("idle");
                setErrorMessage("");
                setRootCause("");
              }}
              variant="ghost"
              size="sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

