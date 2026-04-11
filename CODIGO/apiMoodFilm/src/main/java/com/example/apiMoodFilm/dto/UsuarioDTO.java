
package com.example.apiMoodFilm.dto;

import java.time.LocalDateTime;

public class UsuarioDTO {

    private Long id;
    private String username;
    private String email;
    private LocalDateTime fechaRegistro;
    private String fotoPerfil; 
    private String bio;        
    private String generoFavorito; 
    private String password;  

    public UsuarioDTO(Long id, String username, String email, LocalDateTime fechaRegistro ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
    }

     public UsuarioDTO(){
     }
     
    // Getters y setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    
}
