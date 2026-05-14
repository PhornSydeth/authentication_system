import React from "react";
import { cn } from "./cn";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl",
                "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:to-60%",
                className
            )}
        >
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("mb-8 text-center", className)}>{children}</div>;
}
