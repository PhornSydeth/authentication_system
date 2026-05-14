export type RegisterRequest={
    username:string,
    email:string,
    password:string
}
export type LoginRequest={
    email:string,
    password:string
}

export type RegisterResponse = {
    username: string;
    email: string;
}

/** Body for POST /verify-email (registration OTP). */
export type VerifyEmailRequest = {
    email: string;
    otp: string;
};

/** Body for POST /send (password reset — email only). Matches backend `OtpRequest`. */
export type SendPasswordResetOtpRequest = {
    email: string;
};

/** Body for POST /changePass. Matches backend `UpdatePassReq` (`newPass` field name). */
export type ChangePasswordRequest = {
    email: string;
    otp: string;
    newPass: string;
};

/** Response from POST /verify-email after successful registration verification. */
export type VerificationAuthResponse = {
    message: string;
    redirectUrl: string;
    user: RegisterResponse;
}