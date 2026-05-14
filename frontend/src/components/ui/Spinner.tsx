import { cn } from "./cn";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-3 text-slate-400", className)} role="status" aria-live="polite">
            <span
                className="h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400"
                aria-hidden
            />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}
