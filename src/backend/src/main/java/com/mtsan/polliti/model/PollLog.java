package com.mtsan.polliti.model;

import com.mtsan.polliti.global.Globals;

import javax.persistence.*;
import java.math.BigInteger;
import java.sql.Timestamp;

@Entity
@Table(name = Globals.POLLS_LOGS_TABLE_NAME)
public class PollLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "BIGINT") // columnDefinition BIGINT forces Hibernate to use BIGINT with BigInteger
    private BigInteger id;

    @Column(name = "message", columnDefinition = "TEXT") // columnDefinition TEXT forces Hibernate to use TEXT with String
    private String message;

    @Column(name = "timestamp")
    private Timestamp timestamp;

    public PollLog() {
    }

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
