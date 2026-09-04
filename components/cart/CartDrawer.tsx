"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import GarmentSVG from "@/components/product/GarmentSVG";
import RazorpayCheckoutModal from "@/components/checkout/RazorpayCheckoutModal";

function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function CartDrawer() {
  const {
    items,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotalPaise,
    discountPercent,
    discountPaise,
    couponCode,
    applyCoupon,
    removeCoupon,
    shippingPaise,
    taxPaise,
    totalPaise,
    freeShippingThresholdPaise,
    amountNeededForFreeShippingPaise,
    clearCart,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [receiptId, setReceiptId] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThresholdPaise - amountNeededForFreeShippingPaise) / freeShippingThresholdPaise) * 100)
  );

  const exceedsBudget = totalPaise > 500000; // ₹5,000 ceiling

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res);
    if (res.success) setInputCoupon("");
  };

  const handleStartCheckout = () => {
    setReceiptId(`TC-CART-${Date.now()}`);
    setCheckoutModalOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        <div
          className="fixed inset-y-0 right-0 max-w-full flex pl-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-screen max-w-md bg-surface-1 border-l border-border flex flex-col justify-between shadow-2xl animate-slide-in-right">
            {/* Header */}
            <div className="p-5 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm uppercase tracking-wider text-foreground font-bold">
                  Shopping Bag
                </span>
                <span className="font-mono text-xs text-text-muted bg-surface-2 border border-border-subtle px-2 py-0.5">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    aria-label="Clear all items in bag"
                    className="font-mono text-[9px] uppercase tracking-wider text-text-muted hover:text-red-400 px-2 py-1 border border-border-subtle hover:border-red-500/40 rounded-xs transition-colors cursor-pointer"
                  >
                    Clear Bag
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close bag"
                  className="w-8 h-8 flex items-center justify-center border border-border-subtle hover:border-border hover:bg-surface-2 transition-colors font-mono text-xs text-text-secondary hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="bg-surface-2/60 px-5 py-3 border-b border-border-subtle">
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-text-muted">
                    {amountNeededForFreeShippingPaise > 0
                      ? `Add ${formatPaise(amountNeededForFreeShippingPaise)} more for FREE Shipping`
                      : "🎉 Free Express Shipping Unlocked!"}
                  </span>
                  <span className="text-text-secondary font-bold">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 border border-border-subtle flex items-center justify-center mb-4 text-text-muted">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-mono text-sm uppercase tracking-wider text-foreground mb-1">
                    Your bag is empty
                  </h3>
                  <p className="font-mono text-[10px] text-text-muted max-w-xs mb-6">
                    Pick a heavyweight blank from our collection or jump into the Studio to customize graphics.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border border-border-subtle bg-surface-2/40 flex gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 bg-surface-1 border border-border-subtle p-2 flex items-center justify-center shrink-0">
                      <GarmentSVG
                        type={item.type}
                        color={item.color.hex}
                        designUrl={item.designPreview}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-mono text-xs uppercase tracking-wider text-foreground truncate pr-4">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-text-muted hover:text-red-400 font-mono text-xs p-0.5"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[9px] text-text-muted mt-1">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 inline-block rounded-full border border-border"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            {item.color.name}
                          </span>
                          <span>•</span>
                          <span>Size: <strong className="text-foreground">{item.size}</strong></span>
                          <span>•</span>
                          <span>{item.printTechnique.toUpperCase()}</span>
                        </div>

                        {item.designName && (
                          <div className="font-mono text-[8px] text-emerald-400 mt-1 uppercase tracking-wider">
                            Print: {item.designName}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle/50">
                        <div className="flex items-center border border-border-subtle bg-surface-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center font-mono text-xs text-text-secondary hover:text-foreground"
                          >
                            −
                          </button>
                          <span className="font-mono text-[10px] w-6 text-center text-foreground font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center font-mono text-xs text-text-secondary hover:text-foreground"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-xs font-bold text-foreground">
                          {formatPaise(item.totalPaise)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary Area */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border-subtle bg-surface-1 space-y-4">
                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. TECH10)"
                    className="flex-1 bg-surface-2 border border-border-subtle px-3 py-1.5 font-mono text-[10px] text-foreground uppercase tracking-wider placeholder:text-text-muted focus:outline-none focus:border-foreground"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-surface-3 border border-border text-foreground font-mono text-[10px] uppercase tracking-wider hover:bg-surface-2 transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponFeedback && (
                  <p className={`font-mono text-[9px] ${couponFeedback.success ? "text-emerald-400" : "text-red-400"}`}>
                    {couponFeedback.message}
                  </p>
                )}

                {couponCode && (
                  <div className="flex items-center justify-between font-mono text-[10px] bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 text-emerald-400">
                    <span>Active Coupon: <strong>{couponCode}</strong> ({discountPercent}% off)</span>
                    <button
                      onClick={removeCoupon}
                      className="text-text-muted hover:text-foreground ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>{formatPaise(subtotalPaise)}</span>
                  </div>

                  {discountPaise > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-{formatPaise(discountPaise)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-text-secondary">
                    <span>Estimated Shipping</span>
                    <span>{shippingPaise === 0 ? "FREE" : formatPaise(shippingPaise)}</span>
                  </div>

                  <div className="flex justify-between text-text-secondary">
                    <span>GST (18%)</span>
                    <span>{formatPaise(taxPaise)}</span>
                  </div>

                  <div className="flex justify-between text-foreground font-bold text-sm pt-2 border-t border-border-subtle">
                    <span>Total Amount</span>
                    <span>{formatPaise(totalPaise)}</span>
                  </div>
                </div>

                {/* Budget Limit Notice */}
                <div className="border border-border-subtle bg-surface-2/40 p-2 text-center">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted block">
                    🛡️ Razorpay Agent Guardrails: ₹5,000 Max Cap
                  </span>
                  {exceedsBudget && (
                    <span className="font-mono text-[9px] text-red-400 font-bold block mt-1">
                      Cart total exceeds maximum budget ceiling of ₹5,000!
                    </span>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleStartCheckout}
                  disabled={exceedsBudget}
                  className="w-full py-3.5 bg-foreground text-background font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  Checkout with Razorpay →
                </button>

                {/* Continue Shopping / Return to Shop Button */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 border border-border-subtle hover:border-border bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-foreground transition-colors cursor-pointer text-center"
                >
                  ← Return to Shop / Continue Shopping
                </button>

                <div className="flex items-center justify-between font-mono text-[8px] text-text-muted uppercase tracking-widest pt-1">
                  <span>🔒 256-Bit Encrypted</span>
                  <span>⚡ Instant Fulfillment</span>
                  <span>↩ 7-Day Returns</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal for Cart */}
      {checkoutModalOpen && (
        <div
          className="fixed inset-0 bg-background/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setCheckoutModalOpen(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <RazorpayCheckoutModal
              amountPaise={totalPaise}
              currency="INR"
              receipt={receiptId}
              notes={{
                itemsCount: String(cartCount),
                coupon: couponCode || "NONE",
                summary: items.map((i) => `${i.quantity}x ${i.name} (${i.size})`).join("; "),
              }}
              failureSimEnabled={false}
              onSuccess={() => {
                clearCart();
                setCheckoutModalOpen(false);
                setIsCartOpen(false);
                alert("Order placed successfully! Check your email for order confirmation.");
              }}
              onFailure={(err) => {
                console.error("Cart checkout error:", err);
              }}
              onReset={() => setCheckoutModalOpen(false)}
            />
            <div className="mt-3 text-center">
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-foreground"
              >
                [ Cancel & Return to Bag ]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
