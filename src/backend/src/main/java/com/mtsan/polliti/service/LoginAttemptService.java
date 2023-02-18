package com.mtsan.polliti.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.mtsan.polliti.global.Globals;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {
    @Value("${agency.max-login-attempts-per-ip}")
    private int maxLoginAttempts;
    private final LoadingCache<String, Integer> attemptsCache;

    // since @Value variables are set after the constructor is called (and we need the maxLoginAttemptsExpireAfterHours in the constructor)
    // we just put it as a variable in the constructor
    public LoginAttemptService(@Value("${agency.max-login-attempts-expire-after-hours}") int maxLoginAttemptsExpireAfterHours) {
        this.attemptsCache = CacheBuilder.newBuilder().expireAfterWrite(maxLoginAttemptsExpireAfterHours, TimeUnit.HOURS).build(new CacheLoader<>() {
            public Integer load(String key) {
                // return 0 attempts for any IP (key) that's not in the cache
                return 0;
            }
        });
    }

    public void loginSucceeded(String key) {
        this.attemptsCache.invalidate(key);
    }

    public void loginFailed(String key) {
        int attempts = 0;
        try {
            attempts = this.attemptsCache.get(key);
        } catch (ExecutionException e) {}
        attempts++;
        this.attemptsCache.put(key, attempts);
    }

    public boolean isBlocked(String key) {
        try {
            return this.attemptsCache.get(key) >= this.maxLoginAttempts;
        } catch (ExecutionException e) {
            return false;
        }
    }

    public String getIpAddress(HttpServletRequest httpServletRequest) {
        String xForwardedForHeader = httpServletRequest.getHeader(Globals.X_FORWARDED_FOR_HEADER);
        if (xForwardedForHeader == null) {
            return httpServletRequest.getRemoteAddr();
        }
        return xForwardedForHeader.split(",")[0];
    }
}
