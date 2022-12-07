package com.mtsan.polliti.dao;

import com.mtsan.polliti.model.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PollOptionDao extends JpaRepository<PollOption, Long> {
}
