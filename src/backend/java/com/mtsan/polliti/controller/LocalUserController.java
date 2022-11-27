package com.mtsan.polliti.controller;

import com.mtsan.polliti.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/user")
@RestController
public class LocalUserController {
    private final UserService userService;

    @Autowired
    public LocalUserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity getUser(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getAuthenticatedUser(authentication));
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity login(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.getAuthenticatedUser(authentication));
    }
}
