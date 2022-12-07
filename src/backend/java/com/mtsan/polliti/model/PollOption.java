package com.mtsan.polliti.model;

import javax.persistence.*;

@Entity
@Table(name = "polls_options")
public class PollOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "votes")
    private Long votes;

    @ManyToOne
    @JoinColumn(name = "poll")
    private Poll poll;

    public PollOption() {
    }

    public PollOption(Long id, String title, Long votes, Poll poll) {
        this.id = id;
        this.title = title;
        this.votes = votes;
        this.poll = poll;
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

    public Long getVotes() {
        return votes;
    }

    public void setVotes(Long votes) {
        this.votes = votes;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }
}
