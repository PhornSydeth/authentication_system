import React, { useState } from "react";
import { resetPasswordWithOtp } from "../../../service/AuthService";
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

const MIN_PASSWORD = 8;

interface ForgotPasswordResetFormProps {
    email: string;
    onSuccess: () => void;
}

const ForgotPasswordResetForm: React.FC<ForgotPasswordResetFormProps> = ({ email, onSuccess }) => {
    const [otp, setOtp] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPass.length < MIN_PASSWORD) {
            setError(`Password must be at least ${MIN_PASSWORD} characters.`);
            return;
        }
        if (newPass !== confirmPass) {
            setError("Passwords do not match.");
            return;
        }
        if (otp.length < 6) {
            setError("Enter the 6-digit code from your email.");
            return;
        }

        setLoading(true);
        try {
            await resetPasswordWithOtp({ email, otp, newPass });
            onSuccess();
        } catch (err: unknown) {
            const ax = err as { response?: { data?: { message?: string } } };
            setError(ax.response?.data?.message || "Invalid code or unable to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <GradientEyebrow>Reset password</GradientEyebrow>
                <Title>Choose a new password</Title>
                <Subtitle className="mt-2">
                    Code sent to <span className="font-semibold text-slate-200">{email}</span>
                </Subtitle>
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
                <InputField
                    label="New password"
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder={`At least ${MIN_PASSWORD} characters`}
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD}
                    required
                />
                <InputField
                    label="Confirm new password"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    required
                />
                {error && <Alert variant="error">{error}</Alert>}
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                    {loading ? "Updating password…" : "Verify and update password"}
                </Button>
            </form>
        </Card>
    );
};

export default ForgotPasswordResetForm;
