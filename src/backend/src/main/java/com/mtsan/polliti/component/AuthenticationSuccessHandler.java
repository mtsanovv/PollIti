package com.mtsan.polliti.component;

import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.service.LoginAttemptService;
import com.mtsan.polliti.exception.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class AuthenticationSuccessHandler implements ApplicationListener<AuthenticationSuccessEvent> {
    private final HttpServletRequest httpServletRequest;
    private final LoginAttemptService loginAttemptService;

    @Autowired
    public AuthenticationSuccessHandler(HttpServletRequest httpServletRequest, LoginAttemptService loginAttemptService) {
        this.httpServletRequest = httpServletRequest;
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent evt) {
        String ipAddress = this.loginAttemptService.getIpAddress(this.httpServletRequest);
        if(this.loginAttemptService.isBlocked(ipAddress)) {
            // we just need to throw some exception here, the actual handling is done by BasicAuthEntryPoint
            // we can throw an AuthenticationException (it does not have a stack trace) to prevent all the console spam
            throw new AuthenticationException(String.format(ValidationMessages.BLOCKED_IP_ATTEMPTED_LOGIN_ERROR, ipAddress));
        }
        this.loginAttemptService.loginSucceeded(this.loginAttemptService.getIpAddress(this.httpServletRequest));
    }
}
