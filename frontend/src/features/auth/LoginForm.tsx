import React, { useState } from "react";
import type { LoginRequest } from "../../type/type";
import { login as loginRequest, fetchCurrentUser } from "../../service/AuthService";
import { useAuth } from "../../context/AuthContext";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    GradientEyebrow,
    InputField,
    Subtitle,
    TextLink,
    Title,
} from "../../components/ui";

interface LoginFormProps {
    onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await loginRequest(formData);
            const me = await fetchCurrentUser();
            login(me);
            onSuccess();
        } catch (err: unknown) {
            const ax = err as { response?: { data?: { message?: string } } };
            setError(ax.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <GradientEyebrow>Authentication</GradientEyebrow>
                <Title>Sign in</Title>
                <Subtitle className="mt-2">Use your registered email and password to access your workspace.</Subtitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
                {error && <Alert variant="error">{error}</Alert>}
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </Button>
                <div className="pt-1 text-center">
                    <TextLink to="/forgot-password">Forgot password?</TextLink>
                </div>
            </form>
        </Card>
    );
};

export default LoginForm;
