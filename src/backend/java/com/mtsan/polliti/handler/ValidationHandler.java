package com.mtsan.polliti.handler;

import com.mtsan.polliti.service.ExceptionResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ValidationHandler {
    private final ExceptionResponseService exceptionResponseService;

    @Autowired
    public ValidationHandler(ExceptionResponseService exceptionResponseService) {
        this.exceptionResponseService = exceptionResponseService;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return exceptionResponseService.generateExceptionResponseEntityWithValidationErrors(
            new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more fields contain invalid values"),
            e.getBindingResult().getAllErrors()
        );
    }
}
