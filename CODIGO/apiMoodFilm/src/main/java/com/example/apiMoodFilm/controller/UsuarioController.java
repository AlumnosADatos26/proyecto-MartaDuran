package com.example.apiMoodFilm.controller;

import org.springframework.web.bind.annotation.*;
import com.example.apiMoodFilm.dto.UsuarioDTO;
import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.service.UsuarioService;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public UsuarioDTO crearUsuario(@RequestBody Usuario usuario) {
        Usuario u = usuarioService.guardar(usuario);
        return new UsuarioDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFechaRegistro());
    }

    @GetMapping
    public List<UsuarioDTO> obtenerUsuarios() {
        return usuarioService.obtenerTodos()
                .stream()
                .map(u -> new UsuarioDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFechaRegistro()))
                .collect(Collectors.toList());
    }
}
