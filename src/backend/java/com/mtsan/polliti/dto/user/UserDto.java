package com.mtsan.polliti.dto.user;

import com.mtsan.polliti.global.Role;
import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UserDto implements UserWithUsernameDto{
    @NotBlank(message = ValidationMessages.USERNAME_EMPTY)
    @Size(min = ValidationConstants.USERNAME_MIN, max = ValidationConstants.USERNAME_MAX, message = ValidationMessages.USERNAME_REQUIREMENTS)
    @Pattern(regexp = ValidationConstants.USERNAME_REGEX, message = ValidationMessages.USERNAME_CHAR_REQUIREMENTS)
    private String username;

    @NotBlank(message = ValidationMessages.DISPLAY_NAME_EMPTY)
    @Size(min = ValidationConstants.DISPLAY_NAME_MIN, max = ValidationConstants.DISPLAY_NAME_MAX, message = ValidationMessages.DISPLAY_NAME_REQUIREMENTS)
    private String displayName;

    private Role role;
    @NotNull(message = ValidationMessages.ENABLED_FIELD_REQUIRED)
    private Boolean enabled;

    public UserDto() {
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

    public Boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
