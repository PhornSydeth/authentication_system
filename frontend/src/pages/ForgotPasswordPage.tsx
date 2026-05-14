import React from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordEmailForm from "../features/auth/forgot-password/ForgotPasswordEmailForm";
import { AuthShell } from "../components/layout/AuthShell";
import { Muted, TextLink } from "../components/ui";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCodeSent = (email: string) => {
        navigate("/forgot-password/reset", {
            state: {
                email,
                banner:
                    "If this email is registered, a 6-digit code was sent. It expires in 5 minutes. Enter it below with your new password.",
            },
            replace: true,
        });
    };

    return (
        <AuthShell
            footer={
                <Muted>
                    Remember your password?{" "}
                    <TextLink to="/login" variant="accent">
                        Back to sign in
                    </TextLink>
                </Muted>
            }
        >
            <ForgotPasswordEmailForm onCodeSent={handleCodeSent} />
        </AuthShell>
    );
};

export default ForgotPasswordPage;
