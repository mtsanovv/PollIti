package com.mtsan.polliti.config;

import com.mtsan.polliti.component.BasicAuthEntryPoint;
import com.mtsan.polliti.global.Queries;
import com.mtsan.polliti.global.Role;
import com.mtsan.polliti.global.Routes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationEventPublisher;
import org.springframework.security.authentication.DefaultAuthenticationEventPublisher;
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
    UserDetailsManager userDetailsManager (DataSource dataSource) {
        JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
        jdbcUserDetailsManager.setUsersByUsernameQuery(Queries.LOGIN_USER_QUERY);
        jdbcUserDetailsManager.setAuthoritiesByUsernameQuery(Queries.LOGIN_USER_GET_AUTHORITIES_QUERY);
        // previously, one had to explicitly set the password encoder to BCryptPasswordEncoder
        // now, after WebSecurityConfigurerAdapter is deprecated, the PasswordEncoder is defined in a bean (in PasswordEncoderConfig)
        return jdbcUserDetailsManager;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, BasicAuthEntryPoint basicAuthEntryPoint) throws Exception {
        httpSecurity.cors()
                    .and()
                    .csrf().disable()
                    .formLogin().disable()
                    .authorizeRequests()

                    // permissions for /users
                    .antMatchers(Routes.MAIN_USERS_ROUTE).hasAuthority(Role.Administrator.toString())
                    .antMatchers(Routes.USERS_ROUTE_SUBROUTES).hasAuthority(Role.Administrator.toString())

                    // permissions for /polls/tokens/*
                    .antMatchers(Routes.POLLS_TOKENS_ROUTE_SUBROUTES).anonymous()

                    // permissions for /polls/logs/*
                    .antMatchers(Routes.POLLS_LOGS_ROUTE).hasAuthority(Role.Administrator.toString())

                    .anyRequest().authenticated()
                    .and()
                    .httpBasic()
                    .authenticationEntryPoint(basicAuthEntryPoint)
                    .and()
                    .logout()
                    .logoutUrl(Routes.LOGOUT_ROUTE);
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

    @Bean
    AuthenticationEventPublisher authenticationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        // required so that we can have authentication listeners
        return new DefaultAuthenticationEventPublisher(applicationEventPublisher);
    }
}
