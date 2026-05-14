package com.springsecurity.authsystem.service;

import com.springsecurity.authsystem.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface Service {
    UserResponse register(UserRegister register);
    String login(LoginRequest request, HttpServletRequest servletRequest, HttpServletResponse response);
    String logout(HttpServletRequest request, HttpServletResponse response);
    String refreshToken(HttpServletRequest request, HttpServletResponse response);
    VerificationAuthResponse verifyEmail(String email, String otp, HttpServletRequest servletRequest, HttpServletResponse response);
    UserResponse getCurrentUser();
}
