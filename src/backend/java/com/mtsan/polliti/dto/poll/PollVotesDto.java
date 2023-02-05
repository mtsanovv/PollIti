package com.mtsan.polliti.dto.poll;

import java.util.LinkedHashMap;
import java.util.List;

public class PollVotesDto {
    private LinkedHashMap<String, Long> optionsVotes;
    private Long undecidedVotes;
    private List<String> originalOptionsListOrder; // needed so that the frontend can render the same bar chart that the backend generates as an image

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

    public List<String> getOriginalOptionsListOrder() {
        return originalOptionsListOrder;
    }

    public void setOriginalOptionsListOrder(List<String> originalOptionsListOrder) {
        this.originalOptionsListOrder = originalOptionsListOrder;
    }
}
