package com.example.apiMoodFilm.repository;

import com.example.apiMoodFilm.model.Comentario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByTmdbId (Long tmdbId);
    List<Comentario> findByUsuarioId(Long usuarioId);
  //solo publicos (para invitados y otros usuarios)
    List<Comentario> findByTmdbIdAndEsPublicoTrue(Long tmdbId);
}
