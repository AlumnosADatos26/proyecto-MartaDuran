package com.example.apiMoodFilm.repository;

import com.example.apiMoodFilm.model.ListaPelicula;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListaPeliculaRepository extends JpaRepository<ListaPelicula, Long> {
}
