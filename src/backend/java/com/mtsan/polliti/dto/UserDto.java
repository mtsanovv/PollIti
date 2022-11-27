package com.mtsan.polliti.dto;

import com.mtsan.polliti.Role;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class UserDto {
    @NotEmpty(message = "The username must not be empty")
    @Size(min = 3, max = 128, message = "The username has to be between 3 and 128 characters long")
    private String username;
    @NotEmpty(message = "The display name must not be empty")
    @Size(min = 3, max = 1024, message = "The display name has to be between 3 and 1024 characters long")
    private String displayName;
    private Role role;

    public UserDto(String username, String displayName, Role role) {
        this.username = username;
        this.displayName = displayName;
        this.role = role;
    }

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
}
