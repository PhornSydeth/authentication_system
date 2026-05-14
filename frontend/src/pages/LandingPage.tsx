import React from "react";
import { useNavigate } from "react-router-dom";
import { RiShieldFlashFill, RiLockPasswordFill, RiMailSendFill, RiSpeedFill } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi";
import { MeshBackground } from "../components/layout/MeshBackground";
import { Button, Card, DisplayHeading, GradientEyebrow, Subtitle, Title } from "../components/ui";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <RiShieldFlashFill className="text-3xl text-sky-400" />,
            title: "JWT sessions",
            description: "HttpOnly access and refresh cookies with automatic renewal and Redis-backed limits.",
        },
        {
            icon: <RiLockPasswordFill className="text-3xl text-indigo-400" />,
            title: "Password security",
            description: "BCrypt hashing, reset via OTP, and hardened flows designed for production workloads.",
        },
        {
            icon: <RiMailSendFill className="text-3xl text-violet-400" />,
            title: "Email verification",
            description: "Registration and recovery paths with time-boxed codes and clear operator UX.",
        },
        {
            icon: <RiSpeedFill className="text-3xl text-fuchsia-400" />,
            title: "Operational resilience",
            description: "Rate limiting, structured errors, and a UI tier built for trust at first login.",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <MeshBackground />
            <section className="relative z-10 pt-24 pb-24 sm:pt-28 sm:pb-32">
                <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <GradientEyebrow className="mb-6">Authentication System</GradientEyebrow>
                    <DisplayHeading className="leading-[1.05]">
                        Production-grade identity for modern teams
                    </DisplayHeading>
                    <Subtitle className="mx-auto mt-8 max-w-2xl text-lg text-slate-400">
                        Secure registration, email verification, password recovery, and session management — with a
                        polished experience your users will trust from day one.
                    </Subtitle>
                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                        <Button
                            type="button"
                            size="lg"
                            className="min-w-[200px] shadow-sky-500/25"
                            onClick={() => navigate("/register")}
                        >
                            Get started
                            <HiArrowRight className="text-lg" aria-hidden />
                        </Button>
                        <Button type="button" variant="secondary" size="lg" className="min-w-[200px]" onClick={() => navigate("/login")}>
                            View sign-in
                        </Button>
                    </div>
                </div>
            </section>

            <section id="features" className="relative z-10 border-y border-white/5 bg-slate-950/60 py-24 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <Title className="text-3xl sm:text-4xl">Built for security reviews</Title>
                        <Subtitle className="mt-4 text-base">
                            Every surface matches the same design language as your auth APIs — coherent, calm, and
                            enterprise-ready.
                        </Subtitle>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="group h-full border-white/10 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-sky-500/25 hover:bg-white/[0.07]"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-sky-600 via-indigo-700 to-violet-800 p-12 text-center shadow-2xl shadow-indigo-900/40 sm:p-16">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
                        <Title as="h2" className="relative text-3xl text-white sm:text-4xl">
                            Ship auth your security team will approve
                        </Title>
                        <Subtitle className="relative mx-auto mt-6 max-w-xl text-base text-sky-100/90">
                            Start in minutes with the reference UI, or wire the same endpoints into your own design
                            system.
                        </Subtitle>
                        <div className="relative mt-10">
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                className="border-0 bg-white text-indigo-700 shadow-xl hover:bg-sky-50"
                                onClick={() => navigate("/register")}
                            >
                                Create your workspace
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
