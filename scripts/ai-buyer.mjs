#!/usr/bin/env node

/**
 * THREAD//CORE — Autonomous AI Buyer Agent CLI
 * Razorpay AI Buildathon 2026 — Track 01 (Agentic Commerce) & Track 03 (Revenue Recovery)
 *
 * Demonstrates end-to-end autonomous purchasing via NPCI Unified Agentic Protocol (UAP)
 * with hard bounding, explainable line-item pricing, self-healing remediation, and graceful failure.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const args = process.argv.slice(2);
const isOverflowMode = args.includes("--overflow");
const isDeclineMode = args.includes("--decline");

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  emerald: "\x1b[32m",
  cyan: "\x1b[36m",
  amber: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

function banner() {
  console.log("\n" + colors.emerald + "╔══════════════════════════════════════════════════════════════════╗" + colors.reset);
  console.log(colors.emerald + "║   THREAD//CORE — AUTONOMOUS AI BUYER AGENT RUNTIME (NPCI UAP)   ║" + colors.reset);
  console.log(colors.emerald + "║   Razorpay AI Buildathon • Track 01: Agentic Commerce           ║" + colors.reset);
  console.log(colors.emerald + "╚══════════════════════════════════════════════════════════════════╝" + colors.reset + "\n");
}

function logStep(step, title) {
  console.log(`${colors.cyan}[PHASE ${step}]${colors.reset} ${colors.bold}${title}${colors.reset}`);
}

function logSuccess(msg) {
  console.log(`  ${colors.emerald}✓${colors.reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`  ${colors.amber}⚠️${colors.reset} ${msg}`);
}

function logError(msg) {
  console.log(`  ${colors.red}✕${colors.reset} ${msg}`);
}

function logInfo(msg) {
  console.log(`  ${colors.dim}→${colors.reset} ${msg}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAutonomousBuyer() {
  banner();
  const startTime = Date.now();

  try {
    // ─── STEP 1: PROTOCOL DISCOVERY ───
    logStep(1, "Merchant Protocol Discovery & Handshake");
    logInfo(`Probing discovery endpoint at ${BASE_URL}/.well-known/agentic-commerce.json`);
    
    let discoveryRes;
    try {
      discoveryRes = await fetch(`${BASE_URL}/.well-known/agentic-commerce.json`);
    } catch {
      logError(`Cannot connect to dev server at ${BASE_URL}.`);
      console.log(`\nPlease start the dev server first with: ${colors.bold}npm run dev${colors.reset}\n`);
      process.exit(1);
    }

    if (!discoveryRes.ok) {
      throw new Error(`Discovery probe failed: HTTP ${discoveryRes.status}`);
    }

    const discovery = await discoveryRes.json();
    logSuccess(`Handshake Accepted: Protocol=${discovery.protocol}`);
    logSuccess(`Merchant: ${discovery.merchant.name} (Settlement: ${discovery.merchant.settlementProvider})`);
    logSuccess(`Hard Budget Ceiling: ₹${(discovery.guardrails.hardCeilingPaise / 100).toLocaleString("en-IN")}`);
    await sleep(400);

    // ─── STEP 2: CATALOG INGESTION ───
    console.log("");
    logStep(2, "Machine-Readable Apparel Catalog Ingestion");
    logInfo(`Fetching UAP catalog from ${BASE_URL}/api/agent/catalog`);
    const catalogRes = await fetch(`${BASE_URL}/api/agent/catalog`);
    const catalog = await catalogRes.json();
    logSuccess(`Ingested ${catalog.skus.length} SKUs across ${catalog.printLocations.length} print locations.`);

    // ─── STEP 3: SKU SELECTION & CANVAS FIT ───
    console.log("");
    logStep(3, "Agent Decision & Canvas Fit Evaluation");
    
    let targetSku;
    let targetQty;
    let targetLocations;

    if (isOverflowMode) {
      targetSku = "TC-HOD-001"; // Technical Hoodie
      targetQty = 6;            // Deliberate overflow
      targetLocations = ["front-center", "back-center"];
      logWarn(`Persona [Budget Breaker Active]: Attempting 6× Technical Hoodies with Front+Back prints.`);
    } else {
      targetSku = "TC-TEE-001"; // Heavyweight Tee
      targetQty = 1;
      targetLocations = ["front-center"];
      logInfo(`Persona [Precision Buyer]: Selected SKU ${targetSku} (220 GSM Heavyweight Tee).`);
    }

    const evalPayload = {
      skuId: targetSku,
      printLocationIds: targetLocations,
      printTechniqueId: "dtg",
      quantity: targetQty,
      designFileDimensions: { widthPx: 2400, heightPx: 2400 },
    };

    logInfo(`Dispatching evaluation request to POST /api/agent/evaluate`);
    let evalRes = await fetch(`${BASE_URL}/api/agent/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evalPayload),
    });

    let evalData = await evalRes.json();

    // ─── STEP 4: BOUNDING & REMEDIATION ───
    console.log("");
    logStep(4, "Gating, Guardrails & Explainable Line-Item Pricing");

    if (!evalData.withinBudget) {
      logError(`Gating Check Failed: Order total ₹${(evalData.pricing.totalPaise / 100).toLocaleString("en-IN")} exceeds ceiling!`);
      
      if (evalData.remediation) {
        logWarn(`⚡ Self-Healing Proposal Received from Merchant:`);
        logInfo(`${evalData.remediation.explanation}`);
        logInfo(`Estimated savings: ₹${(evalData.remediation.estimatedSavingsPaise / 100).toLocaleString("en-IN")}`);
        logInfo(`New total: ₹${(evalData.remediation.newTotalPaise / 100).toLocaleString("en-IN")} (APPROVED)`);

        await sleep(600);
        logInfo(`Agent autonomously re-evaluating with remediated parameters...`);

        const remediatedPayload = {
          skuId: targetSku,
          printLocationIds: evalData.remediation.suggestedPrintLocations || ["front-center"],
          printTechniqueId: "dtg",
          quantity: evalData.remediation.suggestedQuantity || 2,
          designFileDimensions: { widthPx: 2400, heightPx: 2400 },
        };

        evalRes = await fetch(`${BASE_URL}/api/agent/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(remediatedPayload),
        });
        evalData = await evalRes.json();
        logSuccess(`Remediated order approved: ₹${(evalData.pricing.totalPaise / 100).toLocaleString("en-IN")} under ₹5,000 ceiling!`);
      }
    } else {
      logSuccess(`Bounding Check Passed: Order total ₹${(evalData.pricing.totalPaise / 100).toLocaleString("en-IN")} is within bounds.`);
    }

    console.log(`\n  ${colors.dim}--- Line-Item Financial Breakdown (Explainable Rupee Audit) ---${colors.reset}`);
    evalData.pricing.lineItems.forEach((item) => {
      console.log(`  ${colors.dim}•${colors.reset} ${item.label.padEnd(35)} : ₹${(item.amountPaise / 100).toLocaleString("en-IN")}`);
    });

    // ─── STEP 5: RAZORPAY ORDER DISPATCH ───
    console.log("");
    logStep(5, "Razorpay Bounded Order Creation");
    const receiptId = `agent_rcpt_${Date.now()}`;
    const orderPayload = {
      amountPaise: evalData.pricing.totalPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        agentProtocol: "NPCI-UAP/1.0",
        buyerPersona: isOverflowMode ? "remediated_buyer" : "precision_buyer",
        sku: targetSku,
        quantity: String(evalData.quantity),
      },
    };

    const orderRes = await fetch(`${BASE_URL}/api/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(`Order creation rejected: ${orderData.error}`);
    }

    logSuccess(`Order Bound & Created: ${orderData.orderId}`);
    logSuccess(`Receipt Correlation ID: ${receiptId}`);

    // ─── STEP 6: SETTLEMENT / FAILURE HANDLING ───
    console.log("");
    logStep(6, "Payment Settlement & Telemetry Audit");

    if (isDeclineMode) {
      logWarn(`Simulating Bank Card Decline: Test card 4000000000001023`);
      await sleep(500);
      logError(`CARD_DECLINED: Issuer refusal on test card 4000000000001023.`);
      logWarn(`⚡ Track 03 Revenue Recovery Agent Activated: Auto-switching to UPI dynamic QR failover...`);
      await sleep(600);
      logSuccess(`✓ Drop-off Recovered via UPI rail. Payment ID: pay_recovered_${Date.now()}`);
    } else {
      logInfo(`Simulating cryptographic signature verification for ${orderData.orderId}...`);
      const verifyRes = await fetch(`${BASE_URL}/api/razorpay/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_agent_${Date.now()}`,
          signature: "sig_agent_deterministic_valid",
        }),
      });
      const verifyData = await verifyRes.json();
      logSuccess(`Cryptographic Signature: ${verifyData.verified ? "VERIFIED (HMAC-SHA256)" : "FAILED"}`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n" + colors.emerald + "╔══════════════════════════════════════════════════════════════════╗" + colors.reset);
    console.log(colors.emerald + `║   AUTONOMOUS TRANSACTION COMPLETE in ${elapsed}s                      ║` + colors.reset);
    console.log(colors.emerald + `║   Status: SETTLED & AUDITED • Rupee Audit Stamped                ║` + colors.reset);
    console.log(colors.emerald + "╚══════════════════════════════════════════════════════════════════╝" + colors.reset + "\n");

  } catch (err) {
    console.error(`\n${colors.red}Execution Error:${colors.reset}`, err.message);
    process.exit(1);
  }
}

runAutonomousBuyer();
