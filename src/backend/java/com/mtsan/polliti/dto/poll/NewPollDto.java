package com.mtsan.polliti.dto.poll;

import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;

import javax.validation.constraints.*;

public class NewPollDto {
    @NotBlank(message = ValidationMessages.POLL_TITLE_EMPTY)
    @Size(min = ValidationConstants.POLL_TITLE_MIN, max = ValidationConstants.POLL_TITLE_MAX, message = ValidationMessages.POLL_TITLE_REQUIREMENTS)
    private String title;

    @NotNull(message = ValidationMessages.POLL_THRESHOLD_REQUIRED)
    @Min(value = ValidationConstants.POLL_THRESHOLD_MIN_VALUE, message = ValidationMessages.POLL_THRESHOLD_REQUIREMENTS)
    @Max(value = ValidationConstants.POLL_THRESHOLD_MAX_VALUE, message = ValidationMessages.POLL_THRESHOLD_REQUIREMENTS)
    private Byte threshold;

    public NewPollDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Byte getThreshold() {
        return threshold;
    }

    public void setThreshold(Byte threshold) {
        this.threshold = threshold;
    }
}
