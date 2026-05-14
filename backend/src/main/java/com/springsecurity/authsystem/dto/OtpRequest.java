package com.springsecurity.authsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OtpRequest {
    @Email(message = "Please input valid email")
    @NotBlank(message = "Please enter your email")
    private String email;
}
