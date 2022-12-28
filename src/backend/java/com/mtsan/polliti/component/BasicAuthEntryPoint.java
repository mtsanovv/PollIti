package com.mtsan.polliti.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtsan.polliti.dto.ExceptionDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.service.LoginAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

@Component
public class BasicAuthEntryPoint extends BasicAuthenticationEntryPoint {
    private final LoginAttemptService loginAttemptService;

    @Autowired
    public BasicAuthEntryPoint(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ae) throws IOException {
        // throwing ResponseStatusException here will create internal server error (after all, we handle the default unauthorized state here)
        // thus, we need to manually create an object, serialize it and send it
        response.addHeader("WWW-Authenticate", "Basic realm=\"" + this.getRealmName() + "\"");
        this.createAndSendUnauthorizedResponse(request, response);
    }

    @Override
    public void afterPropertiesSet() {
        this.setRealmName(Globals.REALM_NAME);
        super.afterPropertiesSet();
    }

    private String getUnauthorizedReason(HttpServletRequest httpServletRequest) {
        String ipAddress = this.loginAttemptService.getIpAddress(httpServletRequest);
        if(loginAttemptService.isBlocked(ipAddress)) {
            return ValidationMessages.TOO_MANY_LOGIN_ATTEMPTS_ERROR;
        }
        return ValidationMessages.WRONG_USERNAME_OR_PASSWORD_ERROR;
    }

    private HashMap<String, String> getErrorContent(HttpServletRequest httpServletRequest) {
        HashMap<String, String> errorContent = new HashMap<>();
        errorContent.put(Globals.ERROR_CONTENT_REASON, this.getUnauthorizedReason(httpServletRequest));
        return errorContent;
    }

    private void sendResponse(HttpServletResponse httpServletResponse, String responseBody) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        httpServletResponse.setContentType(Globals.POLLITI_RESPONSES_TYPE);
        httpServletResponse.setCharacterEncoding(Globals.POLLITI_ENCODING);
        out.print(responseBody);
        out.flush();
    }

    private void createAndSendUnauthorizedResponse(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        ExceptionDto exceptionDto = new ExceptionDto(HttpStatus.UNAUTHORIZED.getReasonPhrase(), this.getErrorContent(httpServletRequest));
        String responseBody = new ObjectMapper().writeValueAsString(exceptionDto);
        this.sendResponse(httpServletResponse, responseBody);
    }
}
