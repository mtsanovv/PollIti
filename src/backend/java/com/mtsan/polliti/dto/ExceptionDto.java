package com.mtsan.polliti.dto;

import java.util.HashMap;

public class ExceptionDto {
    private String error;
    private HashMap<String, String> content;

    public ExceptionDto() {
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public HashMap<String, String> getContent() {
        return content;
    }

    public void setContent(HashMap<String, String> content) {
        this.content = content;
    }
}
