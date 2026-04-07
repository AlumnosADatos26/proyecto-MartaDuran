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
        return mapearADTO(c);
    }

    @GetMapping
    public List<ComentarioDTO> obtenerComentarios() {
        return comentarioService.obtenerTodos()
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ComentarioDTO obtenerComentarioPorId(@PathVariable Long id) {
        Comentario c = comentarioService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
        return mapearADTO(c);
    }

    @DeleteMapping("/{id}")
    public void eliminarComentario(@PathVariable Long id) {
        comentarioService.eliminar(id);
    }

    //  metodo  privado para no repetir codigo de conversion
    private ComentarioDTO mapearADTO(Comentario c) {
        return new ComentarioDTO(
                c.getId(),
                c.getTexto(),
                c.getFecha(),
                c.getUsuario().getId(),
                c.getUsuario().getUsername(),
                c.getUsuario().getFotoPerfil(),
                c.getTmdbId(),
                c.isEsPublico(),
                c.getTituloPelicula()
        );
    }

    @GetMapping("/pelicula/{tmdbId}")
    public List<ComentarioDTO> obtenerPorPelicula(
            @PathVariable Long tmdbId,
            @RequestParam(required = false) Long usuarioId) {

        List<Comentario> comentarios;

        if (usuarioId != null) {
            // Usuario logueado: ve públicos + sus privados
            comentarios = comentarioService.obtenerVisiblesParaUsuario(tmdbId, usuarioId);
        } 
        else {
            // Invitado: solo ve los públicos
            comentarios = comentarioService.obtenerPublicosPorPelicula(tmdbId);
        }

        return comentarios.stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<ComentarioDTO> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return comentarioService.obtenerPorUsuario(usuarioId)
                .stream().map(this::mapearADTO).collect(Collectors.toList());
    }
}
