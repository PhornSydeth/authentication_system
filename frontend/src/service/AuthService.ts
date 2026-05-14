import { ApiClient } from "../api/ApiClient";
import type {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    VerifyEmailRequest,
    VerificationAuthResponse,
    SendPasswordResetOtpRequest,
    ChangePasswordRequest,
} from "../type/type";

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await ApiClient.post<RegisterResponse>("/register", data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<void> => {
    await ApiClient.post<string>("/login", data);
};

/** Current user from GET /me (requires auth cookies). */
export const fetchCurrentUser = async (): Promise<RegisterResponse> => {
    const response = await ApiClient.get<RegisterResponse>("/me");
    return response.data;
};

/** Registration email OTP: sets HttpOnly cookies and returns redirect + user state. */
export const verifyRegistrationEmail = async (
    data: VerifyEmailRequest
): Promise<VerificationAuthResponse> => {
    const response = await ApiClient.post<VerificationAuthResponse>("/verify-email", data);
    return response.data;
};

/** Password reset: request OTP to email (`POST /api/v1/send`). */
export const requestPasswordResetOtp = async (email: string): Promise<void> => {
    await ApiClient.post<string>("/send", { email } satisfies SendPasswordResetOtpRequest);
};

/** Password reset: verify OTP and set new password (`POST /api/v1/changePass`). */
export const resetPasswordWithOtp = async (data: ChangePasswordRequest): Promise<void> => {
    await ApiClient.post<string>("/changePass", data);
};

export const logoutRequest = async (): Promise<void> => {
    await ApiClient.post<string>("/logout");
};
