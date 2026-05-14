import React from "react";
import { cn } from "./cn";

export function DisplayHeading({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h1
            className={cn(
                "text-4xl font-extrabold tracking-tight text-white sm:text-5xl",
                "bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent",
                className
            )}
        >
            {children}
        </h1>
    );
}

export function Title({ children, className, as: Tag = "h2" }: { children: React.ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
    return <Tag className={cn("text-2xl font-bold tracking-tight text-white sm:text-3xl", className)}>{children}</Tag>;
}

export function Subtitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={cn("text-sm leading-relaxed text-slate-400 sm:text-base", className)}>{children}</p>;
}

export function Muted({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={cn("text-sm text-slate-500", className)}>{children}</p>;
}

export function FormLabel({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
    return (
        <label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-medium text-slate-300", className)}>
            {children}
        </label>
    );
}

export function GradientEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <p
            className={cn(
                "mb-3 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300",
                className
            )}
        >
            {children}
        </p>
    );
}
