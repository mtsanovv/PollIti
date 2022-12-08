package com.mtsan.polliti.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "polls")
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "threshold")
    private Byte threshold;

    @Column(name = "undecided_votes")
    private Long undecidedVotes;

    @OneToMany(mappedBy = "poll")
    private List<PollOption> pollOptions;

    public Poll() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getUndecidedVotes() {
        return undecidedVotes;
    }

    public void setUndecidedVotes(Long undecidedVotes) {
        this.undecidedVotes = undecidedVotes;
    }

    public List<PollOption> getPollOptions() {
        return pollOptions;
    }

    public void setPollOptions(List<PollOption> pollOptions) {
        this.pollOptions = pollOptions;
    }
}
