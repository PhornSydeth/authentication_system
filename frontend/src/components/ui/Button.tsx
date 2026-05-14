import React, { forwardRef } from "react";
import { cn } from "./cn";

const variants = {
    primary:
        "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 focus-visible:ring-sky-400/50",
    secondary:
        "bg-white/10 text-white border border-white/15 hover:bg-white/15 focus-visible:ring-white/20",
    outline:
        "border border-white/20 bg-transparent text-white hover:bg-white/5 focus-visible:ring-white/25",
    ghost: "text-slate-300 hover:text-white hover:bg-white/5 focus-visible:ring-white/20",
    danger:
        "bg-red-500/15 text-red-200 border border-red-500/40 hover:bg-red-500/25 focus-visible:ring-red-400/40",
} as const;

const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-5 py-3 text-sm font-semibold rounded-xl",
    lg: "px-6 py-3.5 text-base font-semibold rounded-xl",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { className, variant = "primary", size = "md", fullWidth, loading, disabled, children, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent",
                "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {loading && (
                <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden
                />
            )}
            {children}
        </button>
    );
});

Button.displayName = "Button";
