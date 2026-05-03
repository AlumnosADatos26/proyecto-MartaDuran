package com.example.apiMoodFilm.controller;

import com.example.apiMoodFilm.dto.LoginRequest;
import com.example.apiMoodFilm.dto.RegisterRequest;
import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.example.apiMoodFilm.dto.AuthResponse;
import com.example.apiMoodFilm.dto.GoogleAuthRequest;

@RestController
@RequestMapping("/auth")

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public Usuario register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(
                request.getEmail(),
                request.getPassword()
        );
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(@RequestBody GoogleAuthRequest request) {
        return authService.loginWithGoogle(request.getToken());
    }

}
