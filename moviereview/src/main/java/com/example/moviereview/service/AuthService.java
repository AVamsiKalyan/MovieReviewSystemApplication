package com.example.moviereview.service;

import com.example.moviereview.dto.AuthRequest;
import com.example.moviereview.dto.AuthResponse;
import com.example.moviereview.dto.RegisterRequest;
import com.example.moviereview.model.User;
import com.example.moviereview.repository.UserRepository;
import com.example.moviereview.security.JwtService;
import com.example.moviereview.security.JwtTokenBlacklistService;
import java.util.Date;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        CustomUserDetailsService userDetailsService,
        JwtService jwtService,
        JwtTokenBlacklistService jwtTokenBlacklistService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.jwtTokenBlacklistService = jwtTokenBlacklistService;
    }

    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already registered");
        });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(user.getId(), token, user.getEmail(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String storedPassword = user.getPassword();
        boolean looksHashed = storedPassword != null
            && (storedPassword.startsWith("$2a$")
            || storedPassword.startsWith("$2b$")
            || storedPassword.startsWith("$2y$"));

        if (looksHashed) {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } else {
            if (storedPassword == null || !storedPassword.equals(request.getPassword())) {
                throw new IllegalArgumentException("Invalid credentials");
            }

            // One-time upgrade of legacy plaintext password to BCrypt.
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(user.getId(), token, user.getEmail(), user.getRole());
    }

    public void logout(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing Bearer token");
        }

        String token = authorizationHeader.substring(7);
        Date expiration = jwtService.extractExpiration(token);
        jwtTokenBlacklistService.blacklistToken(token, expiration.getTime());
    }
}