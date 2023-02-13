package com.mtsan.polliti.dto.poll;

import java.util.LinkedHashMap;

public class PollVotesDto {
    private LinkedHashMap<String, Long> optionsVotes;
    private Long undecidedVotes;

    public PollVotesDto() {
    }

    public LinkedHashMap<String, Long> getOptionsVotes() {
        return optionsVotes;
    }

    public void setOptionsVotes(LinkedHashMap<String, Long> optionsVotes) {
        this.optionsVotes = optionsVotes;
    }

    public Long getUndecidedVotes() {
        return undecidedVotes;
    }

    public void setUndecidedVotes(Long undecidedVotes) {
        this.undecidedVotes = undecidedVotes;
    }
}
