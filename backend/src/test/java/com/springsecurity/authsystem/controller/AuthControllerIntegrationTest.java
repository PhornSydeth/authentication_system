package com.springsecurity.authsystem.controller;

import com.springsecurity.authsystem.dto.LoginRequest;
import com.springsecurity.authsystem.dto.UserRegister;
import com.springsecurity.authsystem.dto.VerifyEmailRequest;
import com.springsecurity.authsystem.model.Roles;
import com.springsecurity.authsystem.repository.RefreshTokenRepository;
import com.springsecurity.authsystem.repository.RoleRepo;
import com.springsecurity.authsystem.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJsonTesters // Add this
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private JsonMapper jsonMapper;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @BeforeEach
    void setUp() {
        stringRedisTemplate.getConnectionFactory().getConnection().serverCommands().flushDb();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        if (roleRepo.findByName("ROLE_USER").isEmpty()) {
            roleRepo.save(new Roles(null, "ROLE_USER"));
        }
    }

    @Test
    void testRegister() throws Exception {
        UserRegister register = new UserRegister("testuser", "test@example.com", "password123");

        mockMvc.perform(post("/api/v1/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(register)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

    }

    private String otpFromRedisAfterRegister(String email) {
        String otp = stringRedisTemplate.opsForValue().get("VERIFY_" + email.toLowerCase());
        if (otp == null) {
            throw new IllegalStateException("Expected verification OTP in Redis for " + email);
        }
        return otp;
    }

    @Test
    void testLogin() throws Exception {
        // First register
        UserRegister register = new UserRegister("testuser", "test@example.com", "password123");
        mockMvc.perform(post("/api/v1/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(register)));

        String otp = otpFromRedisAfterRegister("test@example.com");
        VerifyEmailRequest verify = new VerifyEmailRequest("test@example.com", otp);
        mockMvc.perform(post("/api/v1/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(verify)))
                .andExpect(status().isOk());

        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");

        mockMvc.perform(post("/api/v1/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("accessToken"))
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(cookie().httpOnly("accessToken", true))
                .andExpect(cookie().httpOnly("refreshToken", true))
                .andExpect(content().string("Login success"));
    }

    @Test
    void testLogout() throws Exception {
        // Register and login to get cookies
        UserRegister register = new UserRegister("testuser", "test@example.com", "password123");
        mockMvc.perform(post("/api/v1/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(register)));

        String otp = otpFromRedisAfterRegister("test@example.com");
        VerifyEmailRequest verify = new VerifyEmailRequest("test@example.com", otp);
        mockMvc.perform(post("/api/v1/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(verify)))
                .andExpect(status().isOk());

        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");
        var result = mockMvc.perform(post("/api/v1/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(loginRequest)))
                .andReturn();

        Cookie accessCookie = result.getResponse().getCookie("accessToken");
        Cookie refreshCookie = result.getResponse().getCookie("refreshToken");

        mockMvc.perform(post("/api/v1/logout")
                        .cookie(accessCookie, refreshCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("accessToken", 0))
                .andExpect(cookie().maxAge("refreshToken", 0))
                .andExpect(content().string("Logout success"));
    }

    @Test
    void testRefreshToken() throws Exception {
        // Register and login to get cookies
        UserRegister register = new UserRegister("testuser", "test@example.com", "password123");
        mockMvc.perform(post("/api/v1/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(register)));

        String otp = otpFromRedisAfterRegister("test@example.com");
        VerifyEmailRequest verify = new VerifyEmailRequest("test@example.com", otp);
        mockMvc.perform(post("/api/v1/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(verify)))
                .andExpect(status().isOk());

        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");
        var result = mockMvc.perform(post("/api/v1/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(loginRequest)))
                .andReturn();

        Cookie refreshCookie = result.getResponse().getCookie("refreshToken");

        mockMvc.perform(post("/api/v1/refresh-token")
                        .cookie(refreshCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("accessToken"))
                .andExpect(content().string("Token refreshed"));
    }

    @Test
    void testVerifyEmailIssuesCookiesAndAllowsHome() throws Exception {
        UserRegister register = new UserRegister("testuser", "test@example.com", "password123");
        mockMvc.perform(post("/api/v1/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(register)));

        String otp = otpFromRedisAfterRegister("test@example.com");
        VerifyEmailRequest verify = new VerifyEmailRequest("test@example.com", otp);
        var verified = mockMvc.perform(post("/api/v1/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(verify)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("accessToken"))
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(jsonPath("$.redirectUrl").value("/home"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                .andReturn();

        Cookie access = verified.getResponse().getCookie("accessToken");
        Cookie refresh = verified.getResponse().getCookie("refreshToken");

        mockMvc.perform(get("/api/v1/home").cookie(access, refresh))
                .andExpect(status().isOk())
                .andExpect(content().string("Hi this is user homepage"));
    }
}
