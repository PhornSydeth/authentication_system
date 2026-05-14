import React from "react";
import OtpForm from "../features/auth/OtpForm";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { Muted, TextLink } from "../components/ui";

type VerifyOtpLocationState = {
    email?: string;
    username?: string;
};

const OtpPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as VerifyOtpLocationState | null;
    const email = state?.email;
    const username = state?.username;

    if (!email) {
        return <Navigate to="/register" replace />;
    }

    const handleSuccess = (redirectUrl: string) => {
        navigate(redirectUrl, { replace: true });
    };

    return (
        <AuthShell
            footer={
                <Muted>
                    Wrong email?{" "}
                    <TextLink to="/register" variant="accent">
                        Start registration again
                    </TextLink>
                </Muted>
            }
        >
            <OtpForm email={email} username={username} onSuccess={handleSuccess} />
        </AuthShell>
    );
};

export default OtpPage;
