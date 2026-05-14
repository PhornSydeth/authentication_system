import React from "react";
import { Link } from "react-router-dom";
import { RiShieldKeyholeFill, RiGithubFill, RiTwitterFill } from "react-icons/ri";
import { Muted, Title } from "../components/ui";

const Footer: React.FC = () => {
    return (
        <footer className="relative border-t border-white/10 bg-slate-950/90 py-16 text-slate-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <div className="mb-5 flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/90 to-indigo-600 ring-1 ring-white/10">
                                <RiShieldKeyholeFill className="text-xl text-white" />
                            </span>
                            <span className="text-lg font-bold text-white">AuthSystem</span>
                        </div>
                        <Muted className="max-w-xs text-sm leading-relaxed">
                            Reference authentication stack for teams who care about security UX, observability, and
                            maintainable React + Spring Boot boundaries.
                        </Muted>
                    </div>

                    <div>
                        <Title as="h3" className="mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
                            Product
                        </Title>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to={{ pathname: "/", hash: "features" }} className="transition-colors hover:text-sky-400">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="transition-colors hover:text-sky-400">
                                    Sign in
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="transition-colors hover:text-sky-400">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <Title as="h3" className="mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
                            Security
                        </Title>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <span className="text-slate-500">JWT + refresh rotation</span>
                            </li>
                            <li>
                                <span className="text-slate-500">Email OTP flows</span>
                            </li>
                            <li>
                                <span className="text-slate-500">Rate-limited endpoints</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <Title as="h3" className="mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
                            Connect
                        </Title>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-sky-500/30 hover:text-white"
                                aria-label="GitHub"
                            >
                                <RiGithubFill size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-sky-500/30 hover:text-white"
                                aria-label="Twitter"
                            >
                                <RiTwitterFill size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 md:flex-row">
                    <p>© {new Date().getFullYear()} AuthSystem. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="cursor-default hover:text-slate-400">Terms</span>
                        <span className="cursor-default hover:text-slate-400">Privacy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
