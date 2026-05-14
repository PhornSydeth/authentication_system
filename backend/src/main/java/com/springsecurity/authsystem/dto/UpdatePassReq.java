package com.springsecurity.authsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePassReq {
    @Email(message = "Please enter valid email")
    @NotBlank(message = "Please enter email")
    private String email;
    @NotBlank(message = "Please input OTP")
    private String otp;
    @NotBlank(message = "Please enter new password")
    @Size(min = 8, message = "You must enter at least 8 characters")
    private String newPass;
}
