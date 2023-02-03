package com.mtsan.polliti.dto.poll;

import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;
import org.hibernate.validator.constraints.UniqueElements;

import javax.validation.constraints.*;
import java.util.List;

public class NewPollDto {
    @NotBlank(message = ValidationMessages.POLL_TITLE_EMPTY)
    @Size(min = ValidationConstants.POLL_TITLE_MIN, max = ValidationConstants.POLL_TITLE_MAX, message = ValidationMessages.POLL_TITLE_REQUIREMENTS)
    private String title;

    @NotNull(message = ValidationMessages.POLL_THRESHOLD_REQUIRED)
    @Min(value = ValidationConstants.POLL_THRESHOLD_MIN_VALUE, message = ValidationMessages.POLL_THRESHOLD_REQUIREMENTS)
    @Max(value = ValidationConstants.POLL_THRESHOLD_MAX_VALUE, message = ValidationMessages.POLL_THRESHOLD_REQUIREMENTS)
    private Byte threshold;

    @NotEmpty(message = ValidationMessages.POLL_OPTIONS_EMPTY)
    @UniqueElements(message = ValidationMessages.POLL_OPTIONS_UNIQUE)
    @Size(min = ValidationConstants.POLL_OPTIONS_MIN_COUNT, max = ValidationConstants.POLL_OPTIONS_MAX_COUNT, message = ValidationMessages.POLL_OPTIONS_COUNT_REQUIREMENTS)
    private List<@NotBlank(message = ValidationMessages.POLL_OPTION_EMPTY) @Size(max = ValidationConstants.POLL_OPTION_MAX_LENGTH, message = ValidationMessages.POLL_OPTION_REQUIREMENTS) String> options;

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

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }
}
