package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Comentario;
import com.example.apiMoodFilm.repository.ComentarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;

    public ComentarioService(ComentarioRepository comentarioRepository) {
        this.comentarioRepository = comentarioRepository;
    }

    public Comentario guardar(Comentario comentario) {
        return comentarioRepository.save(comentario);
    }

    public List<Comentario> obtenerTodos() {
        return comentarioRepository.findAll();
    }

    public Optional<Comentario> obtenerPorId(Long id) {
        return comentarioRepository.findById(id);
    }

    public void eliminar(Long id) {
        comentarioRepository.deleteById(id);
    }
}
