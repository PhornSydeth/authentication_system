import React, { useState } from "react";
import { Link, useNavigate, type To } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiMenuAlt3, HiX, HiUser } from "react-icons/hi";
import { RiShieldKeyholeFill } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { cn } from "../components/ui/cn";
import { ProfileSidebar } from "./ProfileSidebar";

const linkClass = "text-sm font-medium text-slate-300 transition-colors hover:text-white";

const Header: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navLinks: { name: string; to: To }[] = [
        { name: "Home", to: "/" },
        { name: "Features", to: { pathname: "/", hash: "features" } },
    ];

    return (
        <header className="fixed z-50 w-full border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="group flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/20 ring-1 ring-white/15 transition-transform group-hover:scale-105">
                            <RiShieldKeyholeFill className="text-xl text-white" />
                        </span>
                        <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                            AuthSystem
                        </span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.to} className={linkClass}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        {isAuthenticated ? (
                            <>
                                <Link to="/home" className={cn(linkClass, "px-2")}>
                                    Console
                                </Link>
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 ring-1 ring-white/10 transition-transform hover:scale-105 active:scale-95"
                                    title="View Profile"
                                >
                                    <HiUser size={20} className="text-sky-400" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={cn(linkClass, "px-2")}>
                                    Sign in
                                </Link>
                                <Button type="button" size="sm" onClick={() => navigate("/register")}>
                                    Get started
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="rounded-lg px-2 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="mt-2 border-t border-white/10 pt-4">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/home"
                                                className="block rounded-lg px-2 py-2 text-base font-medium text-slate-300 hover:bg-white/5"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Console
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(true);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-base font-medium text-slate-300 hover:bg-white/5"
                                            >
                                                <HiUser size={20} className="text-sky-400" />
                                                Profile
                                            </button>
                                        </>
                                    ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block rounded-lg px-2 py-2 text-base font-medium text-slate-300 hover:bg-white/5"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                    <Button
                                        type="button"
                                        size="md"
                                        fullWidth
                                        className="mt-2"
                                        onClick={() => {
                                            navigate("/register");
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Get started
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isAuthenticated && (
                <ProfileSidebar 
                    isOpen={isProfileOpen} 
                    onClose={() => setIsProfileOpen(false)} 
                />
            )}
        </header>
    );
};

export default Header;
