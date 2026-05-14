import React from "react";
import LoginForm from "../features/auth/LoginForm";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { Alert, Muted, TextLink } from "../components/ui";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const flash = (location.state as { message?: string } | null)?.message;

    const handleSuccess = () => {
        navigate("/home", { replace: true });
    };

    return (
        <AuthShell
            footer={
                <Muted>
                    Don&apos;t have an account?{" "}
                    <TextLink to="/register" variant="accent">
                        Create one
                    </TextLink>
                </Muted>
            }
        >
            {flash && (
                <div className="mb-5">
                    <Alert variant="success">{flash}</Alert>
                </div>
            )}
            <LoginForm onSuccess={handleSuccess} />
        </AuthShell>
    );
};

export default LoginPage;
