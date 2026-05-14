package com.springsecurity.authsystem.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.springsecurity.authsystem.dto.*;
import com.springsecurity.authsystem.service.Service;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {
    private final Service service;

    @GetMapping("/home")
    public ResponseEntity<String> homePage() {
        return ResponseEntity.ok("Hi this is user homepage");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(service.getCurrentUser());
    }
}

