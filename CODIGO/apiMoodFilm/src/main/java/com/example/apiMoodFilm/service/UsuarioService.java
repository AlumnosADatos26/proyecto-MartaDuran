package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.repository.UsuarioRepository;
import com.example.apiMoodFilm.repository.ListaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ListaRepository listaRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
            ListaRepository listaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.listaRepository = listaRepository;
    }

    public Usuario guardar(Usuario usuario) {

        //guardamos usuario primero
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        // listas fijas por defecto
        String[] listasPorDefecto = {
            "Favoritas",
            "Por ver",
            "Vistas"
        };

        for (String nombre : listasPorDefecto) {
            Lista lista = new Lista();
            lista.setNombre(nombre);
            lista.setUsuario(nuevoUsuario);
            listaRepository.save(lista);
        }

        return nuevoUsuario;
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }
}
