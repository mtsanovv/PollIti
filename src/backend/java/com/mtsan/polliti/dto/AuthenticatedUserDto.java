package com.mtsan.polliti.dto;

public class AuthenticatedUserDto {
    private String username;
    private String displayName;
    private String role;

    public AuthenticatedUserDto() {
    }

    public AuthenticatedUserDto(String username, String displayName, String role) {
        this.username = username;
        this.displayName = displayName;
        this.role = role;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
