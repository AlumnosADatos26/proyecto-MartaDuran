
package com.example.apiMoodFilm.dto;

import java.time.LocalDateTime;

public class UsuarioDTO {

    private Long id;
    private String username;
    private String email;
    private LocalDateTime fechaRegistro;

    public UsuarioDTO(Long id, String username, String email, LocalDateTime fechaRegistro) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
    }

    // Getters
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
}
