package com.mtsan.polliti.dto;

import com.mtsan.polliti.Role;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class NewAgentDto extends UserDto {
    @NotEmpty(message = "The password must not be empty")
    @Size(min = 8, max = 50, message = "The password has to be between 8 and 50 characters long")
    private String password;

    public NewAgentDto() {
        super();
        this.postConstruct();
    }

    public NewAgentDto(String username, String displayName, String password) {
        super(username, displayName, null);
        this.password = password;
        this.postConstruct();
    }

    private void postConstruct() {
        this.setRole(Role.Agent);
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
