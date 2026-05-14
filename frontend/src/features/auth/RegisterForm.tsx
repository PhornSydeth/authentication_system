import React, { useState } from "react";
import type { RegisterRequest, RegisterResponse } from "../../type/type";
import { register } from "../../service/AuthService";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    GradientEyebrow,
    InputField,
    Subtitle,
    Title,
} from "../../components/ui";

interface RegisterFormProps {
    onSuccess: (profile: RegisterResponse) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<RegisterRequest>({
        username: "",
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
            const response = await register(formData);
            if (response?.email) {
                onSuccess(response);
            } else {
                setError("Registration failed: Invalid response from server");
            }
        } catch (err: unknown) {
            const ax = err as { response?: { data?: { message?: string } } };
            setError(ax.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <GradientEyebrow>Onboarding</GradientEyebrow>
                <Title>Create your account</Title>
                <Subtitle className="mt-2">
                    Strong passwords and email verification keep your organization protected.
                </Subtitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Display name"
                    autoComplete="username"
                    required
                />
                <InputField
                    label="Work email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    hint="Use a unique passphrase you do not reuse elsewhere."
                    required
                />
                {error && <Alert variant="error">{error}</Alert>}
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    {loading ? "Creating account…" : "Continue to email verification"}
                </Button>
            </form>
        </Card>
    );
};

export default RegisterForm;
