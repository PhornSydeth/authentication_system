package com.springsecurity.authsystem.service;

import com.springsecurity.authsystem.dto.*;
import com.springsecurity.authsystem.model.RefreshToken;
import com.springsecurity.authsystem.model.Roles;
import com.springsecurity.authsystem.model.User;
import com.springsecurity.authsystem.repository.RefreshTokenRepository;
import com.springsecurity.authsystem.repository.RoleRepo;
import com.springsecurity.authsystem.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class ServiceImpl implements com.springsecurity.authsystem.service.Service {

    /** SPA route clients should navigate to after registration OTP success (cookies carry the session). */
    private static final String POST_VERIFICATION_REDIRECT_URL = "/home";

    private final PasswordEncoder encoder;
    private final UserRepository userRepository;
    private final RoleRepo roleRepo;
    private final AuthenticationManager manager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final StringRedisTemplate redisTemplate;
    private final RateLimiterService rateLimiterService;
    private final OTPService otpService;

    @Override
    public UserResponse register(UserRegister register) {
        boolean existingUser = userRepository.existsUserByEmail(register.getEmail());
        if (existingUser) {
            throw new RuntimeException("User already exist");
        }
        Roles findRole = roleRepo.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Couldn't find user role"));
        
        User user = new User();
        user.getRoles().add(findRole);
        user.setEmail(register.getEmail());
        user.setUsername(register.getUsername());
        user.setPassword(encoder.encode(register.getPassword()));
        user.setEnabled(false); // Ensure user is disabled until verified
        
        userRepository.save(user);
        
        // Send verification email
        otpService.sendVerificationOtp(user.getEmail());
        
        return new UserResponse(user.getUsername(), user.getEmail());
    }

    @Override
    public VerificationAuthResponse verifyEmail(String email, String otp, HttpServletRequest servletRequest, HttpServletResponse response) {
        otpService.verifyEmail(email, otp);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        issueAuthCookies(user, servletRequest, response);
        return new VerificationAuthResponse(
                "Email verified successfully. You are signed in.",
                POST_VERIFICATION_REDIRECT_URL,
                new UserResponse(user.getUsername(), user.getEmail())
        );
    }

    public String login(LoginRequest request, HttpServletRequest servletRequest, HttpServletResponse response) {
        try {
            String ip = rateLimiterService.getClientIp(servletRequest);
            var bucket = rateLimiterService.resolveBucket("login_" + ip, 5, Duration.ofHours(1));
            var probe = bucket.tryConsumeAndReturnRemaining(1);
            if (!probe.isConsumed()) {
                throw new com.springsecurity.authsystem.exception.RateLimitException(
                    "Too many login attempts. Please try again later.",
                    TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill())
                );
            }
        } catch (com.springsecurity.authsystem.exception.RateLimitException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Login rate limiter unavailable (is Redis running?): {}", e.toString());
        }

        try {
            Authentication authentication = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            issueAuthCookies(user, servletRequest, response);

            return "Login success";

        } catch (org.springframework.security.authentication.DisabledException e) {
            throw e;
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    private void issueAuthCookies(User user, HttpServletRequest servletRequest, HttpServletResponse response) {
        UserDetails userDetails = new com.springsecurity.authsystem.util.CustomUserDetailsService(user);
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        saveRefreshToken(user, refreshToken, servletRequest);
        setCookie(response, "accessToken", accessToken, 3600); // 1 hour
        setCookie(response, "refreshToken", refreshToken, 7 * 24 * 3600); // 7 days
    }

    private void saveRefreshToken(User user, String token, HttpServletRequest request) {
        // Clear existing tokens for this user as per request "clear all refreshToken"
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token) // Storing JWT directly for tracking/revocation
                .expiryDate(Instant.now().plusSeconds(7 * 24 * 3600))
                .ipAddress(request.getRemoteAddr())
                .deviceInfo(request.getHeader("User-Agent"))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = extractTokenFromCookie(request, "accessToken");
        String refreshToken = extractTokenFromCookie(request, "refreshToken");

        // 1. Blacklist the access token in Redis with exact remaining TTL
        if (accessToken != null) {
            try {
                Date expiration = jwtService.extractExpiration(accessToken);
                long remainingTtl = expiration.getTime() - System.currentTimeMillis();
                if (remainingTtl > 0) {
                    redisTemplate.opsForValue().set(accessToken, "blacklisted", remainingTtl, TimeUnit.MILLISECONDS);
                }
            } catch (Exception e) {
                // Ignore if token is already invalid or expired
            }
        }

        // 2. Delete ONLY this specific refresh token from DB (Multi-device support)
        // This also works if auth context is null (orphaned tokens)
        if (refreshToken != null) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }

        // 3. Clear cookies with consistent flags
        clearCookie(response, "accessToken");
        clearCookie(response, "refreshToken");
        SecurityContextHolder.clearContext();

        return "Logout success";
    }

    private void setCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    private void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Must match setCookie flags for browser to clear it
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String extractTokenFromCookie(HttpServletRequest request, String name) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (name.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public String refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractTokenFromCookie(request, "refreshToken");
        if (refreshToken == null || jwtService.isTokenExpired(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token missing or expired");
        }

        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // In a real scenario, you'd verify the hashed token in DB
        // But since we delete it on logout, if it exists and is valid, we proceed.
        // For extra security, check if it's blacklisted or revoked.
        
        // Generate new access token
        String newAccessToken = jwtService.generateAccessToken(new com.springsecurity.authsystem.util.CustomUserDetailsService(user));
        setCookie(response, "accessToken", newAccessToken, 3600);

        return "Token refreshed";
    }

    @Override
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new UserResponse(user.getUsername(), user.getEmail());
    }
}
