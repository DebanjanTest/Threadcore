import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAuditEntry } from "@/lib/guardrails";
import { updateTransactionStatus } from "@/lib/transactions";

export async function POST(request: NextRequest) {
  const audit = createAuditEntry("PAYMENT_VERIFY", "pending", "Payment verification initiated");

  let body: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body.orderId || body.razorpay_order_id;
  const paymentId = body.paymentId || body.razorpay_payment_id;
  const signature = body.signature || body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { error: "Missing required fields: orderId/razorpay_order_id, paymentId/razorpay_payment_id, signature/razorpay_signature" },
      { status: 400 }
    );
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const isDemo =
    orderId.startsWith("order_demo_") ||
    !keySecret ||
    keySecret.includes("YOUR_KEY_SECRET");

  if (isDemo) {
    audit.status = "success";
    audit.message = `Demo sandbox payment verified for order ${orderId}`;
    audit.metadata = { orderId, paymentId, verified: true, isDemo: true };

    updateTransactionStatus(orderId, "VERIFIED", {
      paymentId,
      signature,
      rawPayload: { verification: "sandbox_auto_verified", verifiedAt: new Date().toISOString() },
    });

    return NextResponse.json({
      verified: true,
      orderId,
      status: "captured",
      isDemo: true,
      audit,
    });
  }

  const body_str = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body_str)
    .digest("hex");

  const verified = expectedSignature === signature;

  if (verified) {
    audit.status = "success";
    audit.message = `Payment verified for order ${orderId}`;
    audit.metadata = { orderId, paymentId, verified: true };

    updateTransactionStatus(orderId, "VERIFIED", {
      paymentId,
      signature,
      rawPayload: { verification: "signature_match_success", verifiedAt: new Date().toISOString() },
    });
  } else {
    audit.status = "error";
    audit.message = `Signature mismatch for order ${orderId}`;
    audit.metadata = {
      orderId,
      paymentId,
      verified: false,
      expected: expectedSignature,
      received: signature,
    };

    updateTransactionStatus(orderId, "FAILED", {
      paymentId,
      signature,
      failureReason: "HMAC_SHA256_SIGNATURE_MISMATCH",
      rawPayload: { verification: "signature_mismatch_failed" },
    });
  }

  return NextResponse.json({
    verified,
    orderId,
    status: verified ? "captured" : "verification_failed",
    audit,
  });
}
