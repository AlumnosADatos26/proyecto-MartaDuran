package com.example.apiMoodFilm.dto;

public class AuthResponse {

    private String token;
    private Long userId;
    private String username;
    private String email;
    private String fotoPerfil;
    private String bio;
    private String generoFavorito;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long userId, String username, String email, String fotoPerfil, String bio, String generoFavorito) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fotoPerfil = fotoPerfil;
        this.bio = bio;
        this.generoFavorito = generoFavorito;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGeneroFavorito() {
        return generoFavorito;
    }

    public void setGeneroFavorito(String generoFavorito) {
        this.generoFavorito = generoFavorito;
    }

    
    
    
}
