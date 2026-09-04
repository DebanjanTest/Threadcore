import type { PricingBreakdown } from "@/lib/types";

interface PriceBreakdownProps {
  pricing: PricingBreakdown;
  quantity: number;
}

function formatPaise(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

export default function PriceBreakdown({
  pricing,
  quantity,
}: PriceBreakdownProps) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-widest">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-foreground" />
          <span className="text-text-muted">Breakdown</span>
        </div>

        <div className="flex items-center gap-0">
          {pricing.lineItems.map((item, i) => {
            if (item.type === "total") return null;
            const isSubtotal = item.label === "Subtotal";
            const effectiveAmount = item.amountPaise * (quantity > 1 ? quantity : 1);
            return (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-2 py-1 ${
                  isSubtotal ? "border-l border-border ml-1" : ""
                }`}
              >
                <span className="text-text-muted hidden lg:inline">
                  {item.label}:
                </span>
                <span
                  className={
                    isSubtotal ? "text-foreground font-semibold" : "text-text-secondary"
                  }
                >
                  {formatPaise(effectiveAmount)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-l border-border pl-3 ml-1">
          <span className="text-text-muted mr-2 hidden lg:inline">Total:</span>
          <span className="text-foreground font-bold">
            {formatPricingTotal(pricing, quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatPricingTotal(pricing: PricingBreakdown, quantity: number): string {
  const unitPrice = pricing.unitTotalPaise || Math.round(pricing.totalPaise / (quantity || 1));
  if (quantity > 1) {
    return `${formatPaise(unitPrice)} × ${quantity} = ${formatPaise(pricing.totalPaise)}`;
  }
  return formatPaise(pricing.totalPaise);
}
