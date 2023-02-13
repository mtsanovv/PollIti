package com.mtsan.polliti.dao;

import com.mtsan.polliti.model.Poll;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PollDao extends JpaRepository<Poll, Long> {
}
