package com.mtsan.polliti.dto.poll;

import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;
import org.hibernate.validator.constraints.UniqueElements;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

public class NewPollOptionsDto {

    @NotEmpty(message = ValidationMessages.POLL_OPTIONS_EMPTY)
    @UniqueElements(message = ValidationMessages.POLL_OPTIONS_UNIQUE)
    @Size(max = ValidationConstants.POLL_OPTIONS_MAX_COUNT, message = ValidationMessages.POLL_OPTIONS_MAX_COUNT)
    private List<@NotBlank(message = ValidationMessages.POLL_OPTION_EMPTY) String> options;

    public NewPollOptionsDto() {
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }
}
