package com.springsecurity.authsystem.service;

import com.springsecurity.authsystem.model.User;
import com.springsecurity.authsystem.repository.UserRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Duration;

@Component
public class OTPService {
    private final StringRedisTemplate template;
    private final JavaMailSender mailSender;
    private static final String OTP_PREFIX = "OTP_";
    private static final String VERIFY_PREFIX = "VERIFY_";
    private static final long OTP_EXPIRATION_MINUTES = 5;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final RateLimiterService rateLimiterService;

    public OTPService(StringRedisTemplate template, JavaMailSender mailSender, UserRepository userRepository, PasswordEncoder encoder, RateLimiterService rateLimiterService) {
        this.template = template;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.rateLimiterService = rateLimiterService;
    }

    public void sendOtpToEmail(String email, String ip) {
        if (!userRepository.existsUserByEmail(email)) {
            return;
        }

        var bucket = rateLimiterService.resolveBucket("otp_send_" + ip, 3, Duration.ofHours(1));
        var probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            throw new com.springsecurity.authsystem.exception.RateLimitException(
                    "Too many OTP requests. Please try again later.",
                    java.util.concurrent.TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill())
            );
        }

        String otp = String.valueOf(new SecureRandom().nextInt(899999) + 100000);
        template.opsForValue().set(OTP_PREFIX + email.toLowerCase(), otp, Duration.ofMinutes(OTP_EXPIRATION_MINUTES));
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your password reset OTP");
        message.setText("Your OTP is " + otp + " . It expires in 5 minutes ");
        mailSender.send(message);
    }

    public void changePasswordWithOtp(String email, String otp, String newPass, String ip) {
        var bucket = rateLimiterService.resolveBucket("otp_verify_" + email.toLowerCase() + "_" + ip, 5, Duration.ofMinutes(15));
        var probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            throw new com.springsecurity.authsystem.exception.RateLimitException(
                    "Too many verification attempts. Please try again later.",
                    java.util.concurrent.TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill())
            );
        }

        String redisKey = OTP_PREFIX + email.toLowerCase();
        String storedOtp = template.opsForValue().getAndDelete(redisKey);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));
        user.setPassword(encoder.encode(newPass));
        userRepository.save(user);
    }

    public void sendVerificationOtp(String email) {
        String otp = String.valueOf(new SecureRandom().nextInt(899999) + 100000);
        template.opsForValue().set(VERIFY_PREFIX + email.toLowerCase(), otp, Duration.ofMinutes(15));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Verify your email");
        message.setText("Your verification code is " + otp + ". It expires in 15 minutes.");
        mailSender.send(message);
    }

    public void verifyEmail(String email, String otp) {
        String redisKey = VERIFY_PREFIX + email.toLowerCase();
        String storedOtp = template.opsForValue().getAndDelete(redisKey);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid or expired verification code");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }
}
