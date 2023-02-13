package com.mtsan.polliti.dao;

import com.mtsan.polliti.global.Queries;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PollOptionDao extends JpaRepository<PollOption, Long> {
    @Query(Queries.POLLOPTIONDAO_FIND_POLL_OPTION_BY_TITLE_AND_POLL)
    List<PollOption> getPollOptionByTitleAndPollId(String optionTitle, Poll poll);
}
