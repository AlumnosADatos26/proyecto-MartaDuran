package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.repository.UsuarioRepository;
import com.example.apiMoodFilm.repository.ListaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ListaRepository listaRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
            ListaRepository listaRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.listaRepository = listaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario guardar(Usuario usuario) {

        //encriptamos la contraseña antes de guardar en la base de datos
        //ein esto, la contraseña llega como null o en texto plano
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);

        //guardamos el usuario con la contraseña ya encriptada
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        //  creamos las tres listas por defecto para el nuevo usuario
        String[] listasPorDefecto = {"Favoritas", "Por ver", "Vistas"};

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
