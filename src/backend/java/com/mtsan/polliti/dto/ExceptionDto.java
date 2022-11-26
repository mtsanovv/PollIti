package com.mtsan.polliti.dto;

public class ExceptionDto {
    private String error;
    private String message;

    public ExceptionDto() {
    }

    public ExceptionDto(String error, String message) {
        this.error = error;
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
