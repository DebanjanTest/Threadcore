import { NextRequest, NextResponse } from "next/server";
import {
  getTransactions,
  recordTransaction,
  updateTransactionStatus,
  resetTransactions,
  TransactionRecord,
} from "@/lib/transactions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const sourceFilter = searchParams.get("source");

  let txs = getTransactions();

  if (statusFilter && statusFilter !== "ALL") {
    txs = txs.filter((t) => t.status === statusFilter);
  }
  if (sourceFilter && sourceFilter !== "ALL") {
    txs = txs.filter((t) => t.source === sourceFilter);
  }

  const all = getTransactions();
  const verified = all.filter((t) => t.status === "VERIFIED");
  const failed = all.filter((t) => t.status === "FAILED");
  const pending = all.filter((t) => t.status === "PENDING");

  const totalGmvPaise = verified.reduce((acc, t) => acc + t.amountPaise, 0);
  const successRate = all.length > 0 ? Math.round((verified.length / all.length) * 100) : 100;

  return NextResponse.json({
    transactions: txs,
    count: txs.length,
    metrics: {
      totalGmvPaise,
      totalOrders: all.length,
      verifiedCount: verified.length,
      failedCount: failed.length,
      pendingCount: pending.length,
      successRatePercent: successRate,
      idempotencyLockActive: true,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, status, details, transaction } = body;

    if (action === "reset") {
      const resetList = resetTransactions();
      return NextResponse.json({ success: true, transactions: resetList });
    }

    if (action === "update" && id && status) {
      const updated = updateTransactionStatus(id, status, details);
      return NextResponse.json({ success: !!updated, transaction: updated });
    }

    if (action === "record" && transaction) {
      const recorded = recordTransaction(transaction);
      return NextResponse.json({ success: true, transaction: recorded });
    }

    // Default: record failure event simulation directly
    if (body.simulateDecline) {
      const simId = `order_sim_fail_${Date.now()}`;
      const rec: TransactionRecord = recordTransaction({
        id: simId,
        receipt: `rcpt_fail_sim_${Date.now()}`,
        amountPaise: body.amountPaise || 70682,
        currency: "INR",
        status: "FAILED",
        source: "SIMULATOR",
        idempotencyKey: `idemp_decline_sim_${Math.random().toString(36).slice(2, 9)}`,
        failureReason:
          "BAD_REQUEST_ERROR: Payment failed on test card 4000 0000 0000 1023 (Bank Issuer Declined)",
        recoveryMethod: "UPI_FAILOVER",
        recoveryStatus: "OFFERED",
        notes: {
          testCard: "4000 0000 0000 1023",
          errorCode: "BAD_REQUEST_ERROR",
          recoveryFailover: "Dynamic UPI QR",
        },
        rawPayload: {
          event: "payment.failed",
          simulated: true,
          card: "4000 0000 0000 1023",
          remediation: "IDEMPOTENCY_LOCK_ENGAGED_UPI_RECOVERY_ISSUED",
        },
      });
      return NextResponse.json({ success: true, transaction: rec });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
