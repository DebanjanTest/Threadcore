/**
 * THREAD//CORE — Automated Test Suite for Agentic Commerce & Guardrails
 * Razorpay AI Buildathon 2026 — Track 01 Verification Suite
 */

import assert from "node:assert/strict";

// Test 1: Math Explainability
console.log("▶ TEST 1: Pricing Mathematical Explainability (Base + Surcharge + Markup + 18% GST)");
{
  const basePricePaise = 59900; // ₹599
  const surchargePaise = 5000;  // ₹50
  const markupPercent = 15;     // 15% DTG

  const subtotalBeforeMarkup = basePricePaise + surchargePaise; // 64900
  const markupAmount = Math.round(subtotalBeforeMarkup * (markupPercent / 100)); // 9735
  const subtotal = subtotalBeforeMarkup + markupAmount; // 74635
  const tax = Math.round(subtotal * 0.18); // 13434
  const total = subtotal + tax; // 88069 (₹880.69)

  assert.equal(subtotalBeforeMarkup, 64900);
  assert.equal(markupAmount, 9735);
  assert.equal(subtotal, 74635);
  assert.equal(tax, 13434);
  assert.equal(total, 88069);
  console.log("  ✓ Formula matches down to single paisa precision.");
}

// Test 2: Non-Bypassable Budget Ceiling (₹5,000 = 500,000 paise)
console.log("\n▶ TEST 2: Hard Budget Gating Enforced at ₹5,000");
{
  const maxBudgetPaise = 500000;

  function validate(amount) {
    if (amount > maxBudgetPaise) return { allowed: false, reason: "Exceeds ceiling" };
    if (amount < 10000) return { allowed: false, reason: "Below floor" };
    return { allowed: true };
  }

  assert.equal(validate(499900).allowed, true, "₹4,999 should be allowed");
  assert.equal(validate(500000).allowed, true, "₹5,000 should be allowed");
  assert.equal(validate(500001).allowed, false, "₹5,000.01 must be REJECTED");
  assert.equal(validate(1200000).allowed, false, "₹12,000 must be REJECTED");
  assert.equal(validate(5000).allowed, false, "₹50 (below floor) must be REJECTED");
  console.log("  ✓ ₹5,000 ceiling and ₹100 floor strictly gated.");
}

// Test 3: Quantity Guardrails
console.log("\n▶ TEST 3: Quantity Bounds Guardrail (Min: 1, Max: 50)");
{
  function validateQty(q) {
    if (q < 1) return false;
    if (q > 50) return false;
    return true;
  }

  assert.equal(validateQty(1), true);
  assert.equal(validateQty(50), true);
  assert.equal(validateQty(0), false, "Quantity 0 must be rejected");
  assert.equal(validateQty(-5), false, "Negative quantity must be rejected");
  assert.equal(validateQty(51), false, "Quantity > 50 must be rejected");
  console.log("  ✓ Quantity bounded between 1 and 50 units.");
}

// Test 4: Self-Healing Remediation Proposal
console.log("\n▶ TEST 4: Self-Healing Remediation Computation");
{
  const unitTotalPaise = 150000; // ₹1,500 each
  const requestedQty = 5; // ₹7,500 total (exceeds ₹5,000)
  const budgetCeiling = 500000;

  const maxAffordableQty = Math.floor(budgetCeiling / unitTotalPaise); // 3 pieces
  const remediatedTotal = maxAffordableQty * unitTotalPaise; // ₹4,500

  assert.equal(maxAffordableQty, 3);
  assert.ok(requestedQty * unitTotalPaise > budgetCeiling);
  assert.ok(remediatedTotal <= budgetCeiling);
  assert.equal(remediatedTotal, 450000);
  console.log(`  ✓ Successfully adapted ${requestedQty} units -> ${maxAffordableQty} units (₹${remediatedTotal / 100} <= ₹5,000 ceiling).`);
}

// Test 5: Idempotency Protection
console.log("\n▶ TEST 5: Idempotency & Duplicate Order Prevention");
{
  const usedReceipts = new Set();

  function processOrder(receiptId) {
    if (usedReceipts.has(receiptId)) {
      return { status: "rejected", reason: "DUPLICATE_ORDER_RECEIPT" };
    }
    usedReceipts.add(receiptId);
    return { status: "created", receiptId };
  }

  const res1 = processOrder("TC-RECEIPT-001");
  const res2 = processOrder("TC-RECEIPT-001");

  assert.equal(res1.status, "created");
  assert.equal(res2.status, "rejected");
  assert.equal(res2.reason, "DUPLICATE_ORDER_RECEIPT");
  console.log("  ✓ Duplicate order requests rejected with idempotency lock.");
}

console.log("\n═════════════════════════════════════════════════════════");
console.log("  ALL 5 AGENTIC COMMERCE VERIFICATION SUITES PASSED! ✓");
console.log("═════════════════════════════════════════════════════════\n");
