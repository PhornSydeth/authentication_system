import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MeshBackground } from "../components/layout/MeshBackground";
import { Button, Card, Muted, Subtitle, Title } from "../components/ui";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
                <MeshBackground />
                <Card className="relative z-10 max-w-md text-center">
                    <Title>Session required</Title>
                    <Subtitle className="mt-3">Please register or sign in to open the console.</Subtitle>
                    <Button type="button" className="mt-8" fullWidth onClick={() => navigate("/register")}>
                        Go to registration
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-white sm:px-8">
            <MeshBackground />
            <div className="relative z-10 mx-auto max-w-4xl">
                <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400/90">Console</p>
                        <Title className="mt-1 text-3xl sm:text-4xl">Welcome back, {user.username}</Title>
                        <Muted className="mt-2 text-sm">You are successfully authenticated.</Muted>
                    </div>
                </header>

                <main>
                    <Card className="border-white/10">
                        <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                            <div>
                                <Title as="h2" className="text-xl sm:text-2xl">
                                    Profile
                                </Title>
                                <Subtitle className="mt-2 text-sm">
                                    Identity attributes from your authenticated session.
                                </Subtitle>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 ring-1 ring-white/5">
                                <Muted className="text-xs uppercase tracking-wider">Username</Muted>
                                <p className="mt-2 text-xl font-semibold text-white">{user.username}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 ring-1 ring-white/5">
                                <Muted className="text-xs uppercase tracking-wider">Email</Muted>
                                <p className="mt-2 break-all text-xl font-semibold text-white">{user.email}</p>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
