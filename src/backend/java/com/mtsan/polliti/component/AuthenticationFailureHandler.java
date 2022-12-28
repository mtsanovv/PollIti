package com.mtsan.polliti.component;

import com.mtsan.polliti.service.LoginAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class AuthenticationFailureHandler implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {
    private final HttpServletRequest httpServletRequest;
    private final LoginAttemptService loginAttemptService;

    @Autowired
    public AuthenticationFailureHandler(HttpServletRequest httpServletRequest, LoginAttemptService loginAttemptService) {
        this.httpServletRequest = httpServletRequest;
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent evt) {
        String ipAddress = this.loginAttemptService.getIpAddress(this.httpServletRequest);
        if(!this.loginAttemptService.isBlocked(ipAddress)) {
            this.loginAttemptService.loginFailed(ipAddress);
        }
    }
}
