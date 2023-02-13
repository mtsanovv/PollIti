package com.mtsan.polliti.model;

import com.mtsan.polliti.global.Globals;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Date;
import java.util.UUID;

@Entity
@Table(name = Globals.POLLS_TOKENS_TABLE_NAME)
public class PollToken {
    @Id
    @GeneratedValue // since GenerationType.UUID is unavailable (Spring Boot uses an older Hibernate?) GenerationType.AUTO (by default) is our best bet
    @Column(name = "uuid")
    @Type(type = "uuid-char") // store UUID in a human-readable string instead of its binary representation
    private UUID uuid;

    @Column(name = "expires_on")
    private Date expiresOn;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "poll")
    private Poll poll;

    public PollToken() {
    }

    public PollToken(Date expiresOn, String email, Poll poll) {
        this.expiresOn = expiresOn;
        this.email = email;
        this.poll = poll;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public Date getExpiresOn() {
        return expiresOn;
    }

    public void setExpiresOn(Date expiresOn) {
        this.expiresOn = expiresOn;
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
}
