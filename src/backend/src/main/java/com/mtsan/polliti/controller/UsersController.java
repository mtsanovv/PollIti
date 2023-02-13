package com.mtsan.polliti.controller;

import com.mtsan.polliti.dto.user.NewAgentDto;
import com.mtsan.polliti.dto.user.UpdatedAgentDto;
import com.mtsan.polliti.dto.user.UserDto;
import com.mtsan.polliti.global.Routes;
import com.mtsan.polliti.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RequestMapping(Routes.MAIN_USERS_ROUTE)
@RestController
public class UsersController {
    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getAllUsers());
    }

    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public ResponseEntity<UserDto> getUser(@PathVariable String username) {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getUser(username));
    }

    @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity<Void> createAgent(@Valid @RequestBody NewAgentDto newAgentDto) throws NoSuchMethodException, MethodArgumentNotValidException {
        this.userService.createAgent(newAgentDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{username}", consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.PATCH)
    public ResponseEntity<Void> updateAgent(@PathVariable String username, @Valid @RequestBody UpdatedAgentDto updatedAgentDto)
                                                                        throws MethodArgumentNotValidException, NoSuchMethodException {
        this.userService.updateAgent(username, updatedAgentDto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @RequestMapping(value = "/{username}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteAgent(@PathVariable String username) {
        this.userService.deleteAgent(username);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
