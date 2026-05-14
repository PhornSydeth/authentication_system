import React, { useState } from "react";
import { verifyRegistrationEmail } from "../../service/AuthService";
import { useAuth } from "../../context/AuthContext";
import {
    Alert,
    Button,
    Card,
    CardHeader,
    GradientEyebrow,
    InputField,
    Muted,
    Subtitle,
    Title,
} from "../../components/ui";

interface OtpFormProps {
    email: string;
    username?: string;
    onSuccess: (redirectUrl: string) => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ email, username, onSuccess }) => {
    const { login } = useAuth();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await verifyRegistrationEmail({ email, otp });
            login(response.user);
            onSuccess(response.redirectUrl || "/home");
        } catch (err: unknown) {
            const ax = err as { response?: { data?: { message?: string } } };
            setError(ax.response?.data?.message || "Invalid or expired code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <GradientEyebrow>Verification</GradientEyebrow>
                <Title>Confirm your email</Title>
                <Subtitle className="mt-2">
                    Enter the 6-digit code we sent to <span className="font-semibold text-slate-200">{email}</span>
                </Subtitle>
                {username && (
                    <Muted className="mt-3 text-center">
                        Signing up as <span className="text-slate-300">{username}</span>
                    </Muted>
                )}
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                    label="One-time code"
                    name="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="••••••"
                    maxLength={6}
                    inputClassName="text-center text-2xl tracking-[0.35em] font-mono"
                    required
                />
                {error && <Alert variant="error">{error}</Alert>}
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={otp.length < 6}>
                    {loading ? "Verifying…" : "Verify and continue"}
                </Button>
            </form>
        </Card>
    );
};

export default OtpForm;
