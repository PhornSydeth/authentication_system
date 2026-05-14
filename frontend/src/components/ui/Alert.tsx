import React from "react";
import { cn } from "./cn";

const styles = {
    error: "border-red-500/40 bg-red-500/10 text-red-100",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
    info: "border-sky-500/40 bg-sky-500/10 text-sky-100",
} as const;

export type AlertVariant = keyof typeof styles;

export function Alert({
    variant,
    children,
    className,
    title,
}: {
    variant: AlertVariant;
    children: React.ReactNode;
    className?: string;
    title?: string;
}) {
    return (
        <div
            role="alert"
            className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", styles[variant], className)}
        >
            {title && <p className="mb-1 font-semibold">{title}</p>}
            {children}
        </div>
    );
}
