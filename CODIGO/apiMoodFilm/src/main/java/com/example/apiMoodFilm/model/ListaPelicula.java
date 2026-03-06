package com.example.apiMoodFilm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ListaPelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tmdbId;

    private String titulo;

    private String posterPath;

    private LocalDateTime fechaAñadida = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "lista_id")
    private Lista lista;

    public ListaPelicula() {
    }

    // Getters y setters  
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Long tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public LocalDateTime getFechaAñadida() {
        return fechaAñadida;
    }

    public void setFechaAñadida(LocalDateTime fechaAñadida) {
        this.fechaAñadida = fechaAñadida;
    }

    public Lista getLista() {
        return lista;
    }

    public void setLista(Lista lista) {
        this.lista = lista;
    }

}
