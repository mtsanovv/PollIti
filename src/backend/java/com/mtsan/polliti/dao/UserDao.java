package com.mtsan.polliti.dao;

import com.mtsan.polliti.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserDao extends JpaRepository<UserModel, Long> {
    @Query("FROM UserModel u WHERE u.username = ?1")
    List<UserModel> getUserByUsername(String username);
}
