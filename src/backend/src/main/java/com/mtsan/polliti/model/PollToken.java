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

    @OneToOne
    @JoinColumn(name = "invitee")
    private PollInvitee invitee;

    public PollToken() {
    }

    public PollToken(Date expiresOn, PollInvitee invitee) {
        this.expiresOn = expiresOn;
        this.invitee = invitee;
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

    public PollInvitee getInvitee() {
        return invitee;
    }

    public void setInvitee(PollInvitee invitee) {
        this.invitee = invitee;
    }
}
