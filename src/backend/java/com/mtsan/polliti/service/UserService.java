package com.mtsan.polliti.service;

import com.mtsan.polliti.ModelMapperWrapper;
import com.mtsan.polliti.dao.UserDao;
import com.mtsan.polliti.dto.NewAgentDto;
import com.mtsan.polliti.dto.UserDto;
import com.mtsan.polliti.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

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
        User authenticatedUser = this.userDao.getUserByUsername(authentication.getName()).get(0);
        return this.modelMapper.map(authenticatedUser, UserDto.class);
    }

    public List<UserDto> getAllUsers() {
        return this.modelMapper.mapList(this.userDao.findAll(), UserDto.class);
    }

    public void createAgent(NewAgentDto newAgentDto) throws NoSuchMethodException, MethodArgumentNotValidException {
        if(this.userDao.getUserCountByUsername(newAgentDto.getUsername()) > 0) {
            this.throwMethodArgumentNotValidExceptionForTakenUsername((newAgentDto));
        }
        this.encodePassword(newAgentDto);
        User userToCreate = this.modelMapper.map(newAgentDto, User.class);
        userToCreate.setEnabled(true);
        this.userDao.save(userToCreate);
    }

    private void throwMethodArgumentNotValidExceptionForTakenUsername(NewAgentDto newAgentDto) throws MethodArgumentNotValidException, NoSuchMethodException {
        BeanPropertyBindingResult bindingResultWithErrors = new BeanPropertyBindingResult(newAgentDto, "newAgentDto");
        FieldError validationError = new FieldError("newAgentDto", "username", "The username provided is already in use");
        bindingResultWithErrors.addError(validationError);
        MethodParameter methodParameterThatFailedValidation = new MethodParameter(
                this.getClass().getDeclaredMethod("createAgent", NewAgentDto.class),
                0
        );
        throw new MethodArgumentNotValidException(methodParameterThatFailedValidation, bindingResultWithErrors);
    }

    private void encodePassword(NewAgentDto newAgentDto) {
        String encodedPassword = this.passwordEncoder.encode(newAgentDto.getPassword());
        newAgentDto.setPassword(encodedPassword);
    }
}
