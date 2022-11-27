package com.mtsan.polliti.dao;

import com.mtsan.polliti.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserDao extends JpaRepository<User, Long> {
    @Query("FROM User u WHERE u.username = ?1")
    List<User> getUserByUsername(String username);

    @Query("SELECT COUNT(u) FROM User u WHERE u.username = ?1")
    Long getUserCountByUsername(String username);
}
