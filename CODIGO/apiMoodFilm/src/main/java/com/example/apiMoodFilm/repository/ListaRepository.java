package com.example.apiMoodFilm.repository;

import com.example.apiMoodFilm.model.Lista;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListaRepository extends JpaRepository<Lista, Long> {
    //busca todas las listas que pertenecen a un usuario
    List<Lista> findByUsuarioId(Long usuarioId);
}
