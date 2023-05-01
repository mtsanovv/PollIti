package com.mtsan.polliti.dao;

import com.mtsan.polliti.global.Queries;
import com.mtsan.polliti.model.PollToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

public interface PollTokenDao extends JpaRepository<PollToken, UUID> {
    @Query(Queries.POLLTOKENDAO_FIND_ALL_EXPIRED_BY_QUERY)
    List<PollToken> findAllExpiredBy(Date date);

    @Query(Queries.POLLTOKENDAO_GET_TOKEN_COUNT_BY_UUID_AND_EXPIRY_DATE_QUERY)
    Long getTokenCountByUuidAndExpiryDate(UUID token, Date date);
}
