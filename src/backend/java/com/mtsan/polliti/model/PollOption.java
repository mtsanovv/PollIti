package com.mtsan.polliti.model;

import com.mtsan.polliti.global.Globals;

import javax.persistence.*;

@Entity
@Table(name = Globals.POLLS_OPTIONS_TABLE_NAME)
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

    public PollOption(String title, Poll poll) {
        this.title = title;
        this.poll = poll;
        this.setVotes(0L);
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
