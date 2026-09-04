import { NextResponse } from "next/server";

export async function GET() {
  const protocolMetadata = {
    protocol: "NPCI-UAP/1.0",
    compatibleProtocols: ["ACP/1.0", "AP2/1.0", "x402"],
    merchant: {
      id: "MERCH_THREADCORE_BLR",
      name: "THREAD//CORE Technical Apparel Studio",
      location: "Bangalore, IN",
      settlementRail: "Razorpay Test / Sandbox APIs",
    },
    boundingRules: {
      hardBudgetCeilingINR: 5000,
      hardBudgetCeilingPaise: 500000,
      minOrderFloorINR: 100,
      maxQuantity: 50,
      taxModel: "GST_18_PERCENT_INCLUSIVE_BREAKDOWN",
    },
    supportedWorkflows: [
      {
        step: 1,
        name: "Discovery",
        method: "GET",
        endpoint: "/api/agent/catalog",
        description: "Returns machine-readable garment SKUs, dimensions, and surcharges.",
      },
      {
        step: 2,
        name: "Bounded Evaluation & Pricing",
        method: "POST",
        endpoint: "/api/agent/evaluate",
        description: "Evaluates print dimensions, enforces budget ceiling, returns self-healing remediation if exceeded.",
      },
      {
        step: 3,
        name: "Gated Order Creation",
        method: "POST",
        endpoint: "/api/razorpay/create-order",
        description: "Creates Razorpay Order ID under cryptographic verification.",
      },
      {
        step: 4,
        name: "Verification & Settlement",
        method: "POST",
        endpoint: "/api/razorpay/verify",
        description: "Verifies HMAC-SHA256 signature and captures payment.",
      },
      {
        step: 5,
        name: "Revenue Recovery Failover",
        description: "Detects card issuer drop-offs and routes to instant UPI dynamic rail.",
      },
    ],
  };

  return NextResponse.json(protocolMetadata, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Protocol-Version": "NPCI-UAP/1.0",
      "X-Merchant-Id": "MERCH_THREADCORE_BLR",
    },
  });
}
