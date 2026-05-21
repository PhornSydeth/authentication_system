package com.springsecurity.authsystem.service;

import com.springsecurity.authsystem.model.Roles;
import com.springsecurity.authsystem.model.User;
import com.springsecurity.authsystem.util.CustomUserDetailsService;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Field;
import java.security.PublicKey;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private UserDetails testUserDetails;

    @BeforeEach
    void setUp() {
        // Create user roles
        Roles userRole = new Roles();
        userRole.setId(1L);
        userRole.setName("ROLE_USER");
        Set<Roles> roles = new HashSet<>();
        roles.add(userRole);

        // Create a mock user
        User user = new User();
        user.setId(99L);
        user.setUsername("testuser");
        user.setEmail("testuser@example.com");
        user.setPassword("hashedpassword123");
        user.setEnabled(true);
        user.setRoles(roles);

        // Wrap user in CustomUserDetailsService which implements UserDetails
        testUserDetails = new CustomUserDetailsService(user);
    }

    @Test
    void testTokenGenerationExtractionAndValidation() {
        // 1. Generate access and refresh tokens
        String accessToken = jwtService.generateAccessToken(testUserDetails);
        String refreshToken = jwtService.generateRefreshToken(testUserDetails);

        assertNotNull(accessToken, "Access token should not be null");
        assertNotNull(refreshToken, "Refresh token should not be null");

        // 2. Validate username extraction
        String extractedUsername = jwtService.extractUsername(accessToken);
        assertEquals("testuser@example.com", extractedUsername, "Extracted username should match user's email");

        // 3. Validate token verification
        assertTrue(jwtService.isTokenValid(accessToken, testUserDetails), "Access token must be valid for the user");
        assertFalse(jwtService.isTokenExpired(accessToken), "Access token should not be expired immediately");
    }

    @Test
    void testVerifyAsymmetricRS256Algorithm() throws Exception {
        // 1. Generate access token
        String accessToken = jwtService.generateAccessToken(testUserDetails);

        // 2. Retrieve public key using reflection to check the signature header
        Field publicKeyField = JwtService.class.getDeclaredField("publicKey");
        publicKeyField.setAccessible(true);
        PublicKey publicKey = (PublicKey) publicKeyField.get(jwtService);
        assertNotNull(publicKey, "Public key must be loaded successfully by JwtService");

        // 3. Parse JWS and assert the signature algorithm
        Jws<Claims> claimsJws = Jwts.parser()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(accessToken);

        // 4. Assert RS256 algorithm in token header
        String algHeader = claimsJws.getHeader().getAlgorithm();
        assertEquals("RS256", algHeader, "Token MUST be signed using RS256 algorithm");
        System.out.println("Validation Success: Token alg header is " + algHeader);
    }
}
