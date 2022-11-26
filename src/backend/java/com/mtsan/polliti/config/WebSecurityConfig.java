package com.mtsan.polliti.config;

import com.mtsan.polliti.Role;
import com.mtsan.polliti.component.BasicAuthEntryPointComponent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    UserDetailsManager userDetailsManager (DataSource dataSource) throws Exception {
        JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
        jdbcUserDetailsManager.setUsersByUsernameQuery("SELECT username, password, enabled FROM users WHERE username = ? AND enabled IS TRUE");
        jdbcUserDetailsManager.setAuthoritiesByUsernameQuery("SELECT u.username, u.role FROM users u WHERE u.username = ?");
        // previously, one had to explicitly set the password encoder to BCryptPasswordEncoder
        // now, after WebSecurityConfigurerAdapter is deprecated, the PasswordEncoder is defined in a bean (in PasswordEncoderConfig)
        return jdbcUserDetailsManager;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, BasicAuthEntryPointComponent basicAuthEntryPointConfig) throws Exception {
        httpSecurity.cors()
                    .and()
                    .csrf().disable()
                    .formLogin().disable()
                    .authorizeRequests()

                    // permissions for /users
                    .antMatchers("/users").hasAuthority(Role.Administrator.toString())
                    .antMatchers("/users/**").hasAuthority(Role.Administrator.toString())

                    // permissions for /survey/*
                    .antMatchers("/survey/*").anonymous()

                    .anyRequest().authenticated()
                    .and()
                    .httpBasic()
                    .authenticationEntryPoint(basicAuthEntryPointConfig)
                    .and()
                    .logout()
                    .logoutUrl("/user/logout");
        return httpSecurity.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${http.allowed-origins}") String httpAllowedOrigins) {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList(httpAllowedOrigins.split(",")));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "DELETE"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return urlBasedCorsConfigurationSource;
    }
}
