package com.mtsan.polliti.service;

import com.mtsan.polliti.dto.ExceptionDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ExceptionResponseService {
    private final ModelMapper modelMapper;

    @Autowired
    public ExceptionResponseService(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public ResponseEntity generateExceptionResponseEntity(ResponseStatusException e) {
        ExceptionDto responseBody = this.modelMapper.map(e, ExceptionDto.class);
        return ResponseEntity.status(e.getStatus()).body(responseBody);
    }
}
