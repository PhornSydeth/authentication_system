import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiX, HiLogout, HiUser, HiMail, HiShieldCheck } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Title, Muted, Modal } from "../components/ui";

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            setIsLogoutModalOpen(false);
            onClose();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (!user) return null;

    return createPortal(
        <>
            <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" 
                    onClick={onClose}
                />
                
                {/* Sidebar */}
                <div className={`absolute right-0 top-0 h-full w-full max-w-sm border-l border-white/10 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/5 p-6">
                            <Title as="h3" className="text-xl">Account</Title>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <HiX size={24} />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-8 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/20 ring-4 ring-slate-800">
                                    <HiUser size={40} className="text-white" />
                                </div>
                                <Title className="text-2xl">{user.username}</Title>
                                <Muted className="mt-1">{user.email}</Muted>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-4 ring-1 ring-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                                            <HiMail size={20} />
                                        </div>
                                        <div>
                                            <Muted className="text-[10px] uppercase tracking-wider font-bold">Email Address</Muted>
                                            <p className="text-sm font-medium text-slate-200">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/5 bg-slate-800/40 p-4 ring-1 ring-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <HiShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <Muted className="text-[10px] uppercase tracking-wider font-bold">Account Status</Muted>
                                            <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Verified
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/5 p-6">
                            <Button 
                                type="button" 
                                variant="danger" 
                                fullWidth 
                                className="group"
                                onClick={() => setIsLogoutModalOpen(true)}
                            >
                                <HiLogout className="mr-2 transition-transform group-hover:-translate-x-1" size={18} />
                                Sign out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Sign out?"
                description="Are you sure you want to logout? You will need to sign in again to access your account."
                confirmText="Sign out"
                onConfirm={handleLogout}
                variant="danger"
                isLoading={isLoggingOut}
            />
        </>
    , document.body);
};
