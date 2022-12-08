package com.mtsan.polliti.dto.user;

import com.mtsan.polliti.Role;
import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class NewAgentDto extends UserDto implements UserWithUsernameDto, UserWithPasswordDto {
    @NotBlank(message = ValidationMessages.PASSWORD_EMPTY)
    @Size(min = ValidationConstants.PASSWORD_MIN, max = ValidationConstants.PASSWORD_MAX, message = ValidationMessages.PASSWORD_REQUIREMENTS)
    @Pattern(regexp = ValidationConstants.PASSWORD_REGEX, message = ValidationMessages.PASSWORD_CHAR_REQUIREMENTS)
    private String password;

    public NewAgentDto() {
        super();
        this.setRole(Role.Agent);
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
