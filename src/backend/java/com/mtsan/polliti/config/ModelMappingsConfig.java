package com.mtsan.polliti.config;

import com.mtsan.polliti.dto.ExceptionDto;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Configuration
public class ModelMappingsConfig {
    private final ModelMapper modelMapper;

    @Autowired
    public ModelMappingsConfig(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.mapResponseStatusExceptionToExceptionDto();
    }

    private void mapResponseStatusExceptionToExceptionDto() {
        TypeMap<ResponseStatusException, ExceptionDto> propertyMapper = this.modelMapper.createTypeMap(ResponseStatusException.class, ExceptionDto.class);
        Converter<HttpStatus, String> responseStatusToString = c -> c.getSource() == null ? null : c.getSource().getReasonPhrase();
        propertyMapper.addMappings(
            mapper -> mapper.using(responseStatusToString).map(ResponseStatusException::getStatus, ExceptionDto::setError)
        );
        propertyMapper.addMapping(ResponseStatusException::getReason, ExceptionDto::setMessage);
    }
}
