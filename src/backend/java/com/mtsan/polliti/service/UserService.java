package com.mtsan.polliti.service;

import com.mtsan.polliti.dao.UserDao;
import com.mtsan.polliti.dto.AuthenticatedUserDto;
import com.mtsan.polliti.model.UserModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final ModelMapper modelMapper;
    private final UserDao userDao;

    @Autowired
    public UserService(ModelMapper modelMapper, UserDao userDao) {
        this.modelMapper = modelMapper;
        this.userDao = userDao;
    }

    public AuthenticatedUserDto getAuthenticatedUser(Authentication authentication) {
        UserModel authenticatedUser = this.userDao.getUserByUsername(authentication.getName()).get(0);
        return this.modelMapper.map(authenticatedUser, AuthenticatedUserDto.class);
    }
}
