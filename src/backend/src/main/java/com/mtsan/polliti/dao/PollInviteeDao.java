package com.mtsan.polliti.dao;

import com.mtsan.polliti.global.Queries;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollInvitee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PollInviteeDao extends JpaRepository<PollInvitee, Long> {
    @Query(Queries.POLLINVITEEDAO_GET_INVITEES_COUNT_BY_EMAIL_AND_POLL_ID)
    Long getInviteesCountByEmailAndPollId(String email, Poll poll);
}
