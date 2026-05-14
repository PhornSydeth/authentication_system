import React from "react";
import RegisterForm from "../features/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import type { RegisterResponse } from "../type/type";
import { AuthShell } from "../components/layout/AuthShell";
import { Muted, TextLink } from "../components/ui";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = (profile: RegisterResponse) => {
        navigate("/verify-otp", {
            state: { email: profile.email, username: profile.username },
            replace: true,
        });
    };

    return (
        <AuthShell
            footer={
                <Muted>
                    Already registered?{" "}
                    <TextLink to="/login" variant="accent">
                        Sign in
                    </TextLink>
                </Muted>
            }
        >
            <RegisterForm onSuccess={handleSuccess} />
        </AuthShell>
    );
};

export default RegisterPage;
