package com.example.apiMoodFilm.dto;

public class ListaDTO {

    private Long id;
    private String nombre;
    private Long usuarioId;

    public ListaDTO(Long id, String nombre, Long usuarioId) {
        this.id = id;
        this.nombre = nombre;
        this.usuarioId = usuarioId;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }
}
