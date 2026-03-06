package com.example.apiMoodFilm.repository;

import com.example.apiMoodFilm.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
}
