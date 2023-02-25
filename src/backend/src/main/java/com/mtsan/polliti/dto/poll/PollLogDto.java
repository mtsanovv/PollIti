package com.mtsan.polliti.dto.poll;

public class PollLogDto {
    private String message;
    private String timestamp;

    public PollLogDto() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
