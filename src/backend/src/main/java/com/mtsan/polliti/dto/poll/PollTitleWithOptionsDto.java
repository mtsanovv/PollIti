package com.mtsan.polliti.dto.poll;

import java.util.List;

public class PollTitleWithOptionsDto {
    private String pollTitle;
    private List<String> pollOptions;

    public PollTitleWithOptionsDto() {
    }

    public String getPollTitle() {
        return pollTitle;
    }

    public void setPollTitle(String pollTitle) {
        this.pollTitle = pollTitle;
    }

    public List<String> getPollOptions() {
        return pollOptions;
    }

    public void setPollOptions(List<String> pollOptions) {
        this.pollOptions = pollOptions;
    }
}
