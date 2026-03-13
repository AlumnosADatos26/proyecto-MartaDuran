package com.example.apiMoodFilm.controller;

import com.example.apiMoodFilm.dto.LoginRequest;
import com.example.apiMoodFilm.dto.RegisterRequest;
import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.example.apiMoodFilm.dto.AuthResponse;

@RestController
@RequestMapping("/auth")
@CrossOrigin
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

}
