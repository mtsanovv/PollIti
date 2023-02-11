package com.mtsan.polliti.dto;

import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class EmailDto {
    @NotBlank(message = ValidationMessages.EMAIL_EMPTY)
    @Email(regexp = ValidationConstants.EMAIL_REGEX, message = ValidationMessages.EMAIL_INVALID)
    @Size(max = ValidationConstants.EMAIL_ADDRESS_MAX, message = ValidationMessages.EMAIL_TOO_LONG)
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
