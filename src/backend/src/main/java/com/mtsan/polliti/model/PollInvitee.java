package com.mtsan.polliti.model;

import com.mtsan.polliti.global.Globals;

import javax.persistence.*;

@Entity
@Table(name = Globals.POLLS_INVITEES_TABLE_NAME)
public class PollInvitee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "poll")
    private Poll poll;

    @OneToOne(mappedBy = "invitee")
    private PollToken associatedPollToken;

    public PollInvitee() {
    }

    public PollInvitee(String email, Poll poll) {
        this.email = email;
        this.poll = poll;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public PollToken getAssociatedPollToken() {
        return associatedPollToken;
    }

    public void setAssociatedPollToken(PollToken associatedPollToken) {
        this.associatedPollToken = associatedPollToken;
    }
}