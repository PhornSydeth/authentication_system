import React, { forwardRef } from "react";
import { cn } from "./cn";
import { FormLabel } from "./Text";

const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 placeholder:text-slate-500 " +
    "transition-colors duration-200 focus:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

export type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string | null;
    hint?: string;
    inputClassName?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
    { label, error, hint, id, className, inputClassName, ...inputProps },
    ref
) {
    const inputId = id ?? inputProps.name;
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && <FormLabel htmlFor={inputId}>{label}</FormLabel>}
            <input ref={ref} id={inputId} className={cn(inputClass, error && "border-red-500/50 focus:ring-red-500/30", inputClassName)} {...inputProps} />
            {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
            {error && <p className="text-xs font-medium text-red-300">{error}</p>}
        </div>
    );
});
InputField.displayName = "InputField";

