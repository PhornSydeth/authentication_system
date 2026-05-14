package com.springsecurity.authsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegister{
        @NotBlank(message = "Please enter username")
        String username;
        @Email(message = "Invalid email")
        @NotBlank(message = "Please enter email")
        String email;
        @NotBlank(message = "Please enter your password")
        @Size(min = 8,message = "Please enter at least 8 character")
        String password;
}
