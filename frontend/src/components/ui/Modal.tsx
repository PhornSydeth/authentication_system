import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import { Button } from "./Button";
import { Title, Subtitle } from "./Text";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    variant?: "default" | "danger";
    isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    confirmText,
    cancelText = "Cancel",
    onConfirm,
    variant = "default",
    isLoading = false,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in duration-200">
                <div className="flex items-start justify-between">
                    <div>
                        <Title as="h3" className="text-xl">
                            {title}
                        </Title>
                        {description && (
                            <Subtitle className="mt-2 text-sm">
                                {description}
                            </Subtitle>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <HiX size={20} />
                    </button>
                </div>

                <div className="mt-6">
                    {children}
                </div>

                {(onConfirm || confirmText) && (
                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === "danger" ? "danger" : "primary"}
                            onClick={onConfirm}
                            loading={isLoading}
                        >
                            {confirmText || "Confirm"}
                        </Button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
