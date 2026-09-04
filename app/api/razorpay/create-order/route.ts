import { NextRequest, NextResponse } from "next/server";
import { getRazorpayInstance } from "@/lib/razorpay";
import { validateBudget, generateReceiptId, createAuditEntry } from "@/lib/guardrails";
import { recordTransaction } from "@/lib/transactions";

export async function POST(request: NextRequest) {
  const audit = createAuditEntry("RZP_ORDER_CREATE", "pending", "Order creation initiated");

  let body: { amountPaise: number; currency: string; receipt: string; notes: Record<string, string>; source?: "HUMAN_WEB" | "AGENT_AUTOPILOT" | "AGENT_CLI" | "SIMULATOR" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { amountPaise, currency, receipt, notes, source } = body;

  if (!amountPaise || amountPaise <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const budgetCheck = validateBudget(amountPaise);
  if (!budgetCheck.allowed) {
    audit.status = "error";
    audit.message = budgetCheck.reason!;
    return NextResponse.json(
      { error: budgetCheck.reason, audit },
      { status: 403 }
    );
  }

  const idempotencyKey =
    request.headers.get("x-idempotency-key") ||
    notes?.idempotencyKey ||
    `idemp_${Math.random().toString(36).substring(2, 10)}`;

  const resolvedSource =
    source ||
    (notes?.client?.toLowerCase().includes("agent")
      ? "AGENT_AUTOPILOT"
      : notes?.client?.toLowerCase().includes("cli")
      ? "AGENT_CLI"
      : "HUMAN_WEB");

  // Detect unconfigured or placeholder credentials
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const isPlaceholder =
    !keyId ||
    keyId.includes("YOUR_KEY_ID") ||
    !keySecret ||
    keySecret.includes("YOUR_KEY_SECRET");

  if (isPlaceholder) {
    const mockOrderId = `order_demo_${Date.now()}`;
    audit.status = "success";
    audit.message = `Demo sandbox order created: ${mockOrderId}`;
    audit.metadata = {
      orderId: mockOrderId,
      amount: amountPaise,
      currency: currency || "INR",
      isDemo: true,
    };

    recordTransaction({
      id: mockOrderId,
      receipt: receipt || generateReceiptId(),
      amountPaise,
      currency: currency || "INR",
      status: "PENDING",
      source: resolvedSource,
      idempotencyKey,
      notes: notes || {},
      rawPayload: { request: body, mode: "sandbox_demo" },
    });

    return NextResponse.json({
      orderId: mockOrderId,
      amount: amountPaise,
      currency: currency || "INR",
      keyId: "rzp_test_DEMO_KEY",
      idempotencyKey,
      isDemo: true,
      audit,
    });
  }

  try {
    const razorpay = getRazorpayInstance();
    const orderReceipt = receipt || generateReceiptId();

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: currency || "INR",
      receipt: orderReceipt,
      notes: notes || {},
    });

    audit.status = "success";
    audit.message = `Order created: ${order.id}`;
    audit.metadata = { orderId: order.id, amount: order.amount, currency: order.currency };

    recordTransaction({
      id: order.id,
      receipt: orderReceipt,
      amountPaise: Number(order.amount),
      currency: order.currency,
      status: "PENDING",
      source: resolvedSource,
      idempotencyKey,
      notes: notes || {},
      rawPayload: { request: body, order },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      idempotencyKey,
      isDemo: false,
      audit,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    audit.status = "error";
    audit.message = `Order creation failed: ${msg}`;
    return NextResponse.json(
      { error: `Failed to create order: ${msg}`, audit },
      { status: 500 }
    );
  }
}
