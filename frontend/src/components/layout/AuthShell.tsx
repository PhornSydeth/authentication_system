import React from "react";
import { Link } from "react-router-dom";
import { RiShieldKeyholeFill } from "react-icons/ri";
import { cn } from "../ui/cn";
import { Muted } from "../ui/Text";
import { MeshBackground } from "./MeshBackground";

export function AuthBrand({ className }: { className?: string }) {
    return (
        <Link to="/" className={cn("group flex flex-col items-center gap-2", className)}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/30 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                <RiShieldKeyholeFill className="text-2xl text-white" />
            </div>
            <div className="text-center">
                <span className="block text-lg font-bold tracking-tight text-white">AuthSystem</span>
                <Muted className="text-xs">Secure access for your product</Muted>
            </div>
        </Link>
    );
}

type AuthShellProps = {
    children: React.ReactNode;
    /** Renders centered under the main column (e.g. nav links). */
    footer?: React.ReactNode;
    className?: string;
};

export function AuthShell({ children, footer, className }: AuthShellProps) {
    return (
        <div className={cn("relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100", className)}>
            <MeshBackground />
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:py-20">
                <AuthBrand className="mb-10" />
                <div className="w-full max-w-md">{children}</div>
                {footer && <div className="mt-10 max-w-md text-center">{footer}</div>}
            </div>
        </div>
    );
}
