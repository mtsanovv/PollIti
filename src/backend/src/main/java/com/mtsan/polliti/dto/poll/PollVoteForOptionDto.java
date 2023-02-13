package com.mtsan.polliti.dto.poll;

import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.NotBlank;

public class PollVoteForOptionDto {
    @NotBlank(message = ValidationMessages.POLL_OPTION_TITLE_EMPTY)
    private String title;

    public PollVoteForOptionDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
