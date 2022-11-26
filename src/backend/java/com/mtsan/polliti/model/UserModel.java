package com.mtsan.polliti.model;

import com.mtsan.polliti.Role;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "users")
public class UserModel implements Serializable {
    public static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username")
    private String username;
    public static final String usernamePattern = "^.{1,128}$";

    @Column(name = "displayName")
    private String displayName;
    public static final String displayNamePattern = "^.{1,1024}$";

    @Column(name = "password")
    private String password;
    public static final String passwordPattern = "^.{8,50}$";

    //enum('ROLE') is to ensure type enum (Types#VARCHAR) instead of enum (Types#CHAR)
    @Column(name = "role", columnDefinition = "enum('ROLE')")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "enabled")
    private boolean enabled;

    public UserModel() {
    }

    public UserModel(Long id, String username, String displayName, String password, Role role, boolean enabled) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
