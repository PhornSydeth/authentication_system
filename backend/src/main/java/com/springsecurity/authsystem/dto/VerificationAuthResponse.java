package com.springsecurity.authsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Returned after successful email verification (registration OTP).
 * HttpOnly access/refresh cookies are also set (same as login).
 * {@code redirectUrl} is intended for the SPA home route once the client wires navigation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationAuthResponse {
    private String message;
    /** Client-side route to navigate to after verification (e.g. SPA /home). */
    private String redirectUrl;
    private UserResponse user;
}
