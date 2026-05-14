package com.springsecurity.authsystem.controller;

import com.springsecurity.authsystem.dto.*;
import com.springsecurity.authsystem.service.OTPService;
import com.springsecurity.authsystem.service.Service;
import com.springsecurity.authsystem.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class AuthController {
    private final Service service;
    private final OTPService otpService;
    private final RateLimiterService rateLimiterService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegister register) {
        UserResponse response = service.register(register);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<VerificationAuthResponse> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse response) {
        return ResponseEntity.ok(service.verifyEmail(request.getEmail(), request.getOtp(), servletRequest, response));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest, HttpServletResponse response) {
        return ResponseEntity.ok(service.login(request, servletRequest, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(service.logout(request, response));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<String> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return ResponseEntity.ok(service.refreshToken(request, response));
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendOTP(@Valid @RequestBody OtpRequest request, HttpServletRequest servletRequest) {
        String ip = rateLimiterService.getClientIp(servletRequest);
        otpService.sendOtpToEmail(request.getEmail(), ip);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/changePass")
    public ResponseEntity<String> changePass(@Valid @RequestBody UpdatePassReq updatePassReq, HttpServletRequest servletRequest) {
        String ip = rateLimiterService.getClientIp(servletRequest);
        otpService.changePasswordWithOtp(updatePassReq.getEmail(), updatePassReq.getOtp(), updatePassReq.getNewPass(), ip);
        return ResponseEntity.ok("Password was update successfully");
    }
}
