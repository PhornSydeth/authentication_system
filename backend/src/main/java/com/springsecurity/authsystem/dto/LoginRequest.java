package com.springsecurity.authsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Please enter email")
    @Email(message = "Please enter valid email")
    private String email;

    @NotBlank(message = "Please enter password")
    private String password;
}
