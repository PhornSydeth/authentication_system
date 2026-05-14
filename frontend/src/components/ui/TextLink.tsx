import React from "react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

export function TextLink({
    to,
    children,
    className,
    variant = "accent",
}: {
    to: string;
    children: React.ReactNode;
    className?: string;
    variant?: "accent" | "muted";
}) {
    return (
        <Link
            to={to}
            className={cn(
                "font-medium underline-offset-4 transition-colors hover:underline",
                variant === "accent" && "text-sky-400 hover:text-sky-300",
                variant === "muted" && "text-slate-400 hover:text-slate-200",
                className
            )}
        >
            {children}
        </Link>
    );
}
