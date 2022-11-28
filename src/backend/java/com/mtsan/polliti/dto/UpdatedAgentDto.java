package com.mtsan.polliti.dto;

import com.mtsan.polliti.Role;
import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UpdatedAgentDto implements UserWithUsernameDto, UserWithPasswordDto {
    @Size(min = ValidationConstants.USERNAME_MIN, max = ValidationConstants.USERNAME_MAX, message = ValidationMessages.USERNAME_REQUIREMENTS)
    @Pattern(regexp = ValidationConstants.USERNAME_REGEX, message = ValidationMessages.USERNAME_CHAR_REQUIREMENTS)
    private String username;

    @Size(min = ValidationConstants.DISPLAY_NAME_MIN, max = ValidationConstants.DISPLAY_NAME_MAX, message = ValidationMessages.DISPLAY_NAME_REQUIREMENTS)
    private String displayName;

    private Role role;

    private Boolean enabled;

    @Size(min = ValidationConstants.PASSWORD_MIN, max = ValidationConstants.PASSWORD_MAX, message = ValidationMessages.PASSWORD_REQUIREMENTS)
    @Pattern(regexp = ValidationConstants.PASSWORD_REGEX, message = ValidationMessages.PASSWORD_CHAR_REQUIREMENTS)
    private String password;

    public UpdatedAgentDto() {
        this.setRole(Role.Agent);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
