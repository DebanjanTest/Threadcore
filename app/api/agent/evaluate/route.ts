import { NextRequest, NextResponse } from "next/server";
import type { AgentEvaluateRequest, AgentEvaluateResponse } from "@/lib/types";
import {
  getSKUById,
  getPrintLocationById,
  getPrintTechniqueById,
} from "@/lib/catalog-data";
import {
  validateBudget,
  validateQuantity,
  validatePrintability,
  calculatePricing,
  calculateUnitPricing,
  createAuditEntry,
} from "@/lib/guardrails";

export async function POST(request: NextRequest) {
  const auditTrail = [];

  auditTrail.push(
    createAuditEntry("AGENT_EVALUATE", "info", "Agent evaluation request received")
  );

  let body: AgentEvaluateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { skuId, printLocationIds, printTechniqueId, quantity, designFileDimensions } = body;

  const sku = getSKUById(skuId);
  if (!sku) {
    auditTrail.push(
      createAuditEntry("AGENT_EVALUATE", "error", `SKU not found: ${skuId}`)
    );
    return NextResponse.json(
      { error: `SKU not found: ${skuId}`, auditTrail },
      { status: 404 }
    );
  }

  const qtyValidation = validateQuantity(quantity);
  if (!qtyValidation.valid) {
    auditTrail.push(
      createAuditEntry("BOUND_CHECK", "error", qtyValidation.reason!)
    );
    return NextResponse.json(
      { error: qtyValidation.reason, auditTrail },
      { status: 400 }
    );
  }

  auditTrail.push(
    createAuditEntry("CANVAS_VALIDATION", "success", `SKU ${skuId} validated`)
  );

  const technique = getPrintTechniqueById(printTechniqueId);
  if (!technique) {
    auditTrail.push(
      createAuditEntry("AGENT_EVALUATE", "error", `Print technique not found: ${printTechniqueId}`)
    );
    return NextResponse.json(
      { error: `Print technique not found: ${printTechniqueId}`, auditTrail },
      { status: 400 }
    );
  }

  let totalSurcharge = 0;
  const validLocations: string[] = [];
  const validationErrors: string[] = [];

  for (const locId of printLocationIds) {
    const loc = getPrintLocationById(locId);
    if (!loc) {
      validationErrors.push(`Print location not found: ${locId}`);
      continue;
    }
    if (!loc.compatibleSKUs.includes(skuId)) {
      validationErrors.push(`Location ${locId} not compatible with ${skuId}`);
      continue;
    }
    totalSurcharge += loc.surchargePaise;
    validLocations.push(locId);
  }

  if (validationErrors.length > 0) {
    auditTrail.push(
      createAuditEntry("BOUND_CHECK", "error", validationErrors.join("; "))
    );
  }

  auditTrail.push(
    createAuditEntry(
      "BOUND_CHECK",
      "success",
      `${validLocations.length} print locations validated, surcharge: ₹${(totalSurcharge / 100).toFixed(0)}`
    )
  );

  if (designFileDimensions) {
    const frontCanvas = sku.canvasBounds.front;
    const printability = validatePrintability(
      designFileDimensions.widthPx,
      designFileDimensions.heightPx,
      frontCanvas.widthMm,
      frontCanvas.heightMm
    );
    if (!printability.valid) {
      validationErrors.push(...printability.issues);
      auditTrail.push(
        createAuditEntry("CANVAS_VALIDATION", "error", printability.issues.join("; "))
      );
    } else {
      auditTrail.push(
        createAuditEntry("CANVAS_VALIDATION", "success", "Design meets canvas requirements")
      );
    }
  }

  const unitPricing = calculateUnitPricing(
    sku.basePricePaise,
    totalSurcharge,
    technique.areaMarkupPercent
  );

  const totalPricing = calculatePricing(
    sku.basePricePaise,
    totalSurcharge,
    technique.areaMarkupPercent,
    quantity
  );

  const budgetCheck = validateBudget(totalPricing.totalPaise);
  let remediation = undefined;

  if (!budgetCheck.allowed) {
    validationErrors.push(budgetCheck.reason!);
    auditTrail.push(
      createAuditEntry("BOUND_CHECK", "error", budgetCheck.reason!)
    );

    // Self-Healing Remediation Strategy
    if (quantity > 1) {
      const maxAffordableQty = Math.max(1, Math.floor(500000 / unitPricing.totalPaise));
      const remediatedPricing = calculatePricing(
        sku.basePricePaise,
        totalSurcharge,
        technique.areaMarkupPercent,
        maxAffordableQty
      );
      remediation = {
        suggestedQuantity: maxAffordableQty,
        suggestedPrintLocations: validLocations,
        estimatedSavingsPaise: totalPricing.totalPaise - remediatedPricing.totalPaise,
        newTotalPaise: remediatedPricing.totalPaise,
        explanation: `Ceiling overflow detected. Self-healing proposal: adjust quantity from ${quantity} to ${maxAffordableQty} to bring total to ₹${(remediatedPricing.totalPaise / 100).toFixed(0)} (within ₹5,000 ceiling).`,
      };
    } else if (validLocations.length > 1) {
      const singleLocPricing = calculatePricing(
        sku.basePricePaise,
        0, // front center has 0 surcharge
        technique.areaMarkupPercent,
        1
      );
      remediation = {
        suggestedQuantity: 1,
        suggestedPrintLocations: ["front-center"],
        estimatedSavingsPaise: totalPricing.totalPaise - singleLocPricing.totalPaise,
        newTotalPaise: singleLocPricing.totalPaise,
        explanation: `Ceiling overflow detected. Self-healing proposal: retain front-center print only to bring total to ₹${(singleLocPricing.totalPaise / 100).toFixed(0)}.`,
      };
    }

    if (remediation) {
      auditTrail.push(
        createAuditEntry(
          "BOUND_CHECK",
          "info",
          `Remediation proposed: ${remediation.explanation}`,
          { remediation }
        )
      );
    }
  }

  const response: AgentEvaluateResponse = {
    pricing: totalPricing,
    unitPricing,
    quantity,
    withinBudget: budgetCheck.allowed,
    budgetCeilingPaise: 500000,
    validationErrors,
    recommendation: budgetCheck.allowed
      ? `Order for ${quantity}× ${sku.name} is within budget at ₹${(totalPricing.totalPaise / 100).toFixed(0)}`
      : `Order exceeds budget ceiling. ${remediation ? remediation.explanation : "Reduce quantity or select a different garment."}`,
    remediation,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: { "X-Audit-Entries": String(auditTrail.length) },
  });
}
