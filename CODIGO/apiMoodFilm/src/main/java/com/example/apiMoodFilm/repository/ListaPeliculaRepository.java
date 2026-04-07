package com.example.apiMoodFilm.repository;

import com.example.apiMoodFilm.model.ListaPelicula;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListaPeliculaRepository extends JpaRepository<ListaPelicula, Long> {
    //busva todas las pelis de una lista concreta
    List<ListaPelicula> findByListaId(Long listaId);
    //omprueba si ya existe una pelicula con ese tmdbId en esa lista
    boolean existsByListaIdAndTmdbId(Long listaId, Long tmdbId);
}
