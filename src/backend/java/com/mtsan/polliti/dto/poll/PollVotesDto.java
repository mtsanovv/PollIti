package com.mtsan.polliti.dto.poll;

import java.util.HashMap;

public class PollVotesDto {
    private HashMap<String, Long> optionsVotes;
    private Long undecidedVotes;

    public PollVotesDto() {
    }

    public HashMap<String, Long> getOptionsVotes() {
        return optionsVotes;
    }

    public void setOptionsVotes(HashMap<String, Long> optionsVotes) {
        this.optionsVotes = optionsVotes;
    }

    public Long getUndecidedVotes() {
        return undecidedVotes;
    }

    public void setUndecidedVotes(Long undecidedVotes) {
        this.undecidedVotes = undecidedVotes;
    }
}
