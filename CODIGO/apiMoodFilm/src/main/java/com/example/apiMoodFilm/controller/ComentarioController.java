package com.example.apiMoodFilm.controller;

import com.example.apiMoodFilm.dto.ComentarioDTO;
import com.example.apiMoodFilm.model.Comentario;
import com.example.apiMoodFilm.service.ComentarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comentarios")
@CrossOrigin
public class ComentarioController {

    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    @PostMapping
    public ComentarioDTO crearComentario(@RequestBody Comentario comentario) {
        Comentario c = comentarioService.guardar(comentario);
        return new ComentarioDTO(c.getId(), c.getTexto(), c.getFecha(),
                c.getUsuario().getId(), c.getLista().getId());
    }

    @GetMapping
    public List<ComentarioDTO> obtenerComentarios() {
        return comentarioService.obtenerTodos()
                .stream()
                .map(c -> new ComentarioDTO(c.getId(), c.getTexto(), c.getFecha(),
                c.getUsuario().getId(), c.getLista().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ComentarioDTO obtenerComentarioPorId(@PathVariable Long id) {
        Comentario c = comentarioService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        return new ComentarioDTO(c.getId(), c.getTexto(), c.getFecha(),
                c.getUsuario().getId(), c.getLista().getId());
    }

    @DeleteMapping("/{id}")
    public void eliminarComentario(@PathVariable Long id) {
        comentarioService.eliminar(id);
    }
}
