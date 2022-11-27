package com.mtsan.polliti.controller;

import com.mtsan.polliti.dto.NewAgentDto;
import com.mtsan.polliti.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@RequestMapping("/users")
@RestController
public class UsersController {
    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity getUsers(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getAllUsers());
    }

    @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity createAgent(@Valid @RequestBody NewAgentDto newAgent) throws ResponseStatusException, NoSuchMethodException, MethodArgumentNotValidException {
        this.userService.createAgent(newAgent);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
