package com.mtsan.polliti.dao;

import com.mtsan.polliti.model.PollToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PollTokenDao extends JpaRepository<PollToken, UUID> {
}
