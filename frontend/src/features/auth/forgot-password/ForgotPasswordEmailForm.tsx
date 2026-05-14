import React, { useState } from "react";
import { requestPasswordResetOtp } from "../../../service/AuthService";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    GradientEyebrow,
    InputField,
    Subtitle,
    Title,
} from "../../../components/ui";

interface ForgotPasswordEmailFormProps {
    onCodeSent: (email: string) => void;
}

const ForgotPasswordEmailForm: React.FC<ForgotPasswordEmailFormProps> = ({ onCodeSent }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await requestPasswordResetOtp(email.trim());
            onCodeSent(email.trim());
        } catch (err: unknown) {
            const ax = err as { response?: { data?: { message?: string } } };
            setError(ax.response?.data?.message || "Could not send reset code. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <GradientEyebrow>Account recovery</GradientEyebrow>
                <Title>Forgot password</Title>
                <Subtitle className="mt-2">
                    Enter your account email. If it exists in our system, we&apos;ll email a one-time reset code.
                </Subtitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                />
                {error && <Alert variant="error">{error}</Alert>}
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    {loading ? "Sending code…" : "Send reset code"}
                </Button>
            </form>
        </Card>
    );
};

export default ForgotPasswordEmailForm;
