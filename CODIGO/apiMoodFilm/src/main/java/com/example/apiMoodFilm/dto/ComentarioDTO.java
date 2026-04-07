package com.example.apiMoodFilm.dto;

import java.time.LocalDateTime;

public class ComentarioDTO {

    private Long id;
    private String texto;
    private LocalDateTime fecha;
    private Long usuarioId;
    private String username;
    private String fotoPerfil;
    private Long tmdbId;
    private boolean esPublico;
    private String tituloPelicula;

    public ComentarioDTO(Long id, String texto, LocalDateTime fecha, Long usuarioId, String username, String fotoPerfil, Long tmdbId,boolean esPublico, String tituloPelicula) {
        this.id = id;
        this.texto = texto;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
        this.username = username;
        this.fotoPerfil = fotoPerfil;
        this.tmdbId = tmdbId;
        this.esPublico = esPublico;
        this.tituloPelicula = tituloPelicula;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsername() {
        return username;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public boolean isEsPublico() {
        return esPublico;
    }

    public void setEsPublico(boolean esPublico) {
        this.esPublico = esPublico;
    }

    public String getTituloPelicula() {
        return tituloPelicula;
    }

    public void setTituloPelicula(String tituloPelicula) {
        this.tituloPelicula = tituloPelicula;
    }
    
    

}
