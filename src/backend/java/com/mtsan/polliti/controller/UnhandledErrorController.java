package com.mtsan.polliti.controller;

import com.mtsan.polliti.global.Routes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@RestController
public class UnhandledErrorController implements ErrorController {

    @RequestMapping(value = Routes.ERROR_ROUTE)
    public void showError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            HttpStatus httpStatus = HttpStatus.resolve(statusCode);

            if(httpStatus != null) {
                throw new ResponseStatusException(httpStatus);
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    public String getErrorPath() {
        return null;
    }
}
