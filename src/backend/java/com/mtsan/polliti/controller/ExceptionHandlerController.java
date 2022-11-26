package com.mtsan.polliti.controller;

import com.mtsan.polliti.service.ExceptionResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ExceptionHandlerController {

    private final ExceptionResponseService exceptionResponseService;

    @Autowired
    public ExceptionHandlerController(ExceptionResponseService exceptionResponseService) {
        this.exceptionResponseService = exceptionResponseService;
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity handleResponseStatusException(ResponseStatusException e) {
        return exceptionResponseService.generateExceptionResponseEntity(e);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        return exceptionResponseService.generateExceptionResponseEntity(new ResponseStatusException(HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        return exceptionResponseService.generateExceptionResponseEntity(new ResponseStatusException(HttpStatus.BAD_REQUEST));
    }
}
