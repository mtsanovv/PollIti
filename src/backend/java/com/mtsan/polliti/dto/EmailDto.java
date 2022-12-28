package com.mtsan.polliti.dto;

import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class EmailDto {
    @NotBlank(message = ValidationMessages.EMAIL_EMPTY)
    @Email(regexp = ".+[@].+[\\.].+", message = ValidationMessages.EMAIL_INVALID)
    private String email;

    public EmailDto() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
