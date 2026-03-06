package com.example.apiMoodFilm.dto;

import java.time.LocalDateTime;

public class ComentarioDTO {

    private Long id;
    private String texto;
    private LocalDateTime fecha;
    private Long usuarioId;
    private Long listaId;

    public ComentarioDTO(Long id, String texto, LocalDateTime fecha, Long usuarioId, Long listaId) {
        this.id = id;
        this.texto = texto;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
        this.listaId = listaId;
    }

    // Getters
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

    public Long getListaId() {
        return listaId;
    }
}
