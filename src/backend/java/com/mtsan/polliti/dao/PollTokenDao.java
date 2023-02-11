package com.mtsan.polliti.dao;

import com.mtsan.polliti.global.Queries;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.UUID;

public interface PollTokenDao extends JpaRepository<PollToken, UUID> {
    @Modifying
    @Query(Queries.POLLTOKENDAO_DELETE_ALL_EXPIRED_BY_QUERY)
    void deleteAllExpiredBy(Date date);

    @Query(Queries.POLLTOKENDAO_GET_TOKEN_COUNT_BY_UUID_AND_EXPIRY_DATE_QUERY)
    Long getTokenCountByUuidAndExpiryDate(UUID token, Date date);

    @Query(Queries.POLLTOKENDAO_GET_TOKEN_COUNT_BY_EMAIL_AND_POLL_ID)
    Long getTokenCountByEmailAndPollId(String email, Poll poll);
}
