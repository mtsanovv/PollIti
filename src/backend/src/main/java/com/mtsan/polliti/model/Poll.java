package com.mtsan.polliti.model;

import com.mtsan.polliti.global.Globals;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = Globals.POLLS_TABLE_NAME)
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

    @Column(name = "creation_date")
    private Date creationDate;

    @OneToMany(mappedBy = "poll")
    private List<PollOption> pollOptions;

    @OneToMany(mappedBy = "poll")
    private List<PollInvitee> pollInvitees;

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

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public List<PollOption> getPollOptions() {
        return pollOptions;
    }

    public void setPollOptions(List<PollOption> pollOptions) {
        this.pollOptions = pollOptions;
    }

    public List<PollInvitee> getPollInvitees() {
        return pollInvitees;
    }

    public void setPollInvitees(List<PollInvitee> pollInvitees) {
        this.pollInvitees = pollInvitees;
    }
}
