package com.mtsan.polliti.dto.poll;

import java.util.List;

public class PollDto extends BasicPollDto {
    private Byte threshold;

    private List<String> options;

    public PollDto() {
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
