import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import ForgotPasswordResetForm from "../features/auth/forgot-password/ForgotPasswordResetForm";
import { AuthShell } from "../components/layout/AuthShell";
import { Alert, Muted, TextLink } from "../components/ui";

type LocationState = { email?: string; banner?: string };

const ForgotPasswordResetPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState | null;
    const email = state?.email;
    const banner = state?.banner;

    if (!email) {
        return <Navigate to="/forgot-password" replace />;
    }

    const handleSuccess = () => {
        navigate("/login", {
            replace: true,
            state: { message: "Password updated. Sign in with your email and new password." },
        });
    };

    return (
        <AuthShell
            footer={
                <Muted>
                    Wrong email?{" "}
                    <TextLink to="/forgot-password" variant="accent">
                        Start over
                    </TextLink>
                </Muted>
            }
        >
            {banner && (
                <div className="mb-5">
                    <Alert variant="success">{banner}</Alert>
                </div>
            )}
            <ForgotPasswordResetForm email={email} onSuccess={handleSuccess} />
        </AuthShell>
    );
};

export default ForgotPasswordResetPage;
