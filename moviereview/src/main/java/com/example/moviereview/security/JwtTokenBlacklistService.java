package com.example.moviereview.security;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenBlacklistService {

    private final Map<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token, long expiresAtMillis) {
        blacklistedTokens.put(token, expiresAtMillis);
    }

    public boolean isBlacklisted(String token) {
        Long expiresAt = blacklistedTokens.get(token);
        if (expiresAt == null) {
            return false;
        }

        if (expiresAt < System.currentTimeMillis()) {
            blacklistedTokens.remove(token);
            return false;
        }

        return true;
    }
}