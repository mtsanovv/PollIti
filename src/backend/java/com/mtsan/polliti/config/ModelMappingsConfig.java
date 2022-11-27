package com.mtsan.polliti.config;

import com.mtsan.polliti.ModelMapperWrapper;
import com.mtsan.polliti.dto.ExceptionDto;
import org.modelmapper.Converter;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;

@Configuration
public class ModelMappingsConfig {
    private final ModelMapperWrapper modelMapper;

    @Autowired
    public ModelMappingsConfig(ModelMapperWrapper modelMapper) {
        this.modelMapper = modelMapper;
        this.mapResponseStatusExceptionToExceptionDto();
    }

    private void mapResponseStatusExceptionToExceptionDto() {
        TypeMap<ResponseStatusException, ExceptionDto> propertyMapper = this.modelMapper.createTypeMap(ResponseStatusException.class, ExceptionDto.class);
        Converter<HttpStatus, String> responseStatusToString = c -> c.getSource() == null ? null : c.getSource().getReasonPhrase();
        Converter<String, HashMap<String, String>> reasonStringToHashMap = c -> {
            HashMap<String, String> exceptionContent = new HashMap<>();
            exceptionContent.put("reason", c.getSource());
            return exceptionContent;
        };
        propertyMapper.addMappings(
            mapper -> mapper.using(responseStatusToString).map(ResponseStatusException::getStatus, ExceptionDto::setError)
        );
        propertyMapper.addMappings(
            mapper -> mapper.using(reasonStringToHashMap).map(ResponseStatusException::getReason, ExceptionDto::setContent)
        );
    }
}
