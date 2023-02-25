package com.mtsan.polliti.dao;

import com.mtsan.polliti.model.PollLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface PollLogDao extends JpaRepository<PollLog, BigInteger> {
}
