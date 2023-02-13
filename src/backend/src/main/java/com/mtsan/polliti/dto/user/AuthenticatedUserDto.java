package com.mtsan.polliti.dto.user;

import com.mtsan.polliti.global.Role;

public class AuthenticatedUserDto {
    private String displayName;
    private Role role;

    public AuthenticatedUserDto() {
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
