package com.mtsan.polliti.service;

import com.mtsan.polliti.ModelMapperWrapper;
import com.mtsan.polliti.Role;
import com.mtsan.polliti.dao.UserDao;
import com.mtsan.polliti.dto.*;
import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class UserService {
    private final ModelMapperWrapper modelMapper;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(ModelMapperWrapper modelMapper, UserDao userDao, PasswordEncoder passwordEncoder) {
        this.modelMapper = modelMapper;
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto getAuthenticatedUser(Authentication authentication) {
        User authenticatedUser = this.userDao.getUsersByUsername(authentication.getName()).get(0);
        return this.modelMapper.map(authenticatedUser, UserDto.class);
    }

    public List<UserDto> getAllUsers() {
        // we always have at least one user - the one that's logged in to access this endpoint
        return this.modelMapper.mapList(this.userDao.findAll(), UserDto.class);
    }

    public UserDto getUser(String username) {
        if(this.userDao.getUserCountByUsername(username) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format(ValidationMessages.USER_NOT_FOUND, username));
        }
        return this.modelMapper.map( this.userDao.getUsersByUsername(username).get(0), UserDto.class);
    }

    public void createAgent(NewAgentDto newAgentDto) throws NoSuchMethodException, MethodArgumentNotValidException {
        if(this.userDao.getUserCountByUsername(newAgentDto.getUsername()) > 0) {
            this.throwMethodArgumentNotValidExceptionForTakenUsername(newAgentDto);
        }
        this.encodePassword(newAgentDto);
        User userToCreate = this.modelMapper.map(newAgentDto, User.class);
        this.userDao.save(userToCreate);
    }

    public void updateAgent(String username, UpdatedAgentDto updatedAgentDto) throws MethodArgumentNotValidException, NoSuchMethodException {
        this.checkIfUserExistsAndIsAgent(username);
        this.updateUserModelFromUpdateAgentDto(this.userDao.getUsersByUsername(username).get(0), updatedAgentDto);
    }

    @Transactional
    public void deleteAgent(String username) {
        this.checkIfUserExistsAndIsAgent(username);
        this.userDao.deleteUserByUsername(username);
    }

    private void checkIfUserExistsAndIsAgent(String username) {
        if(this.userDao.getUserCountByUsername(username) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format(ValidationMessages.USER_NOT_FOUND, username));
        }
        if(this.userDao.getUsersByUsername(username).get(0).getRole() != Role.Agent) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format(ValidationMessages.USER_NOT_AGENT, username));
        }
    }

    private void updateUserModelFromUpdateAgentDto(User userModel, UpdatedAgentDto updatedAgentDto)
                                                                        throws MethodArgumentNotValidException, NoSuchMethodException {
        if(updatedAgentDto.getUsername() != null) {
            if(this.userDao.getUserCountByUsername(updatedAgentDto.getUsername()) > 0) {
                this.throwMethodArgumentNotValidExceptionForTakenUsername(updatedAgentDto);
            }
            userModel.setUsername(updatedAgentDto.getUsername());
        }

        if(updatedAgentDto.getDisplayName() != null) {
            userModel.setDisplayName(updatedAgentDto.getDisplayName());
        }

        if(updatedAgentDto.getEnabled() != null) {
            userModel.setEnabled(updatedAgentDto.getEnabled());
        }

        if(updatedAgentDto.getPassword() != null) {
            this.encodePassword(updatedAgentDto);
            userModel.setPassword(updatedAgentDto.getPassword());
        }
        this.userDao.save(userModel);
    }

    private void throwMethodArgumentNotValidExceptionForTakenUsername(UserWithUsernameDto userWithUsernameDto)
                                                                        throws MethodArgumentNotValidException, NoSuchMethodException {
        BeanPropertyBindingResult bindingResultWithErrors = new BeanPropertyBindingResult(userWithUsernameDto, "userWithUsernameDto");
        FieldError validationError = new FieldError(
                "userWithUsernameDto",
                "username",
                String.format(ValidationMessages.USERNAME_ALREADY_IN_USE, userWithUsernameDto.getUsername())
        );
        bindingResultWithErrors.addError(validationError);
        MethodParameter methodThatThrowsValidationErrorForClass = new MethodParameter(
                this.getClass().getDeclaredMethod("throwMethodArgumentNotValidExceptionForTakenUsername", UserWithUsernameDto.class),
                0
        );
        throw new MethodArgumentNotValidException(methodThatThrowsValidationErrorForClass, bindingResultWithErrors);
    }

    private void encodePassword(UserWithPasswordDto userWithPasswordDto) {
        String encodedPassword = this.passwordEncoder.encode(userWithPasswordDto.getPassword());
        userWithPasswordDto.setPassword(encodedPassword);
    }
}
