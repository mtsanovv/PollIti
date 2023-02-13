package com.mtsan.polliti.dao;

import com.mtsan.polliti.global.Queries;
import com.mtsan.polliti.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserDao extends JpaRepository<User, Long> {
    @Query(Queries.USERDAO_FIND_USERS_BY_USERNAME_QUERY)
    List<User> getUsersByUsername(String username);

    @Query(Queries.USERDAO_COUNT_USERS_BY_USERNAME_QUERY)
    Long getUserCountByUsername(String username);

    @Modifying
    @Query(Queries.USERDAO_DELETE_USER_BY_USERNAME_QUERY)
    void deleteUserByUsername(String username);
}
