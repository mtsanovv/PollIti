package com.mtsan.polliti.config;

import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.Version;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FacebookClientConfig {
    @Bean
    FacebookClient createFacebookClient(@Value("${restfb.page.access-token}") String pageAccessToken) {
        return new DefaultFacebookClient(pageAccessToken, Version.VERSION_15_0);
    }
}
