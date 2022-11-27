package com.mtsan.polliti.config;

import com.mtsan.polliti.ModelMapperWrapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperWrapperConfig {
    @Bean
    public ModelMapperWrapper modelMapperWrapper() {
        return new ModelMapperWrapper();
    }
}
