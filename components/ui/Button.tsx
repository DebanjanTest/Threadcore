"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "buy"
  | "cart"
  | "shimmer"
  | "glow"
  | "cyber"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background font-semibold hover:bg-zinc-200 active:scale-[0.98] shadow-sm border border-border",
  buy:
    "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] shadow-md border border-amber-400/30",
  cart:
    "bg-surface-2 text-foreground font-semibold hover:bg-surface-3 active:scale-[0.98] border border-border shadow-sm",
  shimmer:
    "relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:brightness-105 active:scale-[0.98] shadow-md border border-amber-400/30",
  glow:
    "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] shadow-md border border-amber-400/20",
  cyber:
    "bg-surface-2 text-foreground font-semibold border border-border hover:border-zinc-500 hover:bg-surface-3 active:scale-[0.98]",
  secondary:
    "border border-border bg-surface-2 text-foreground font-medium hover:bg-surface-3 active:scale-[0.98]",
  outline:
    "border border-border-subtle bg-transparent text-text-secondary font-medium hover:text-foreground hover:border-border active:scale-[0.98]",
  danger:
    "border border-red-500/30 bg-red-950/20 text-red-400 font-medium hover:bg-red-900/30 active:scale-[0.98]",
  ghost:
    "bg-transparent text-text-secondary font-medium hover:text-foreground hover:bg-surface-2 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5",
  sm: "h-8 px-3.5 text-xs gap-2",
  md: "h-10 px-5 text-sm gap-2.5",
  lg: "h-12 px-7 text-sm gap-3",
  xl: "h-14 px-9 text-base gap-3.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center select-none rounded-sm
          font-sans tracking-tight transition-all duration-150 cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {/* Shimmer light sweep beam overlay for shimmer variant */}
        {variant === "shimmer" && !loading && !disabled && (
          <span
            className="absolute inset-0 pointer-events-none w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"
            aria-hidden="true"
          />
        )}

        {/* Loading Spinner */}
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
