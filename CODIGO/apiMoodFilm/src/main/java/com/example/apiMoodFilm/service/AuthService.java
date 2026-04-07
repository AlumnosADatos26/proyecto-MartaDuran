package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.dto.RegisterRequest;
import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.apiMoodFilm.model.AuthProvider;
import com.example.apiMoodFilm.security.JwtUtil;
import com.example.apiMoodFilm.dto.AuthResponse;
import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.repository.ListaRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ListaRepository listaRepository;

    public AuthService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            ListaRepository listaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.listaRepository = listaRepository;
    }

    public Usuario register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setProveedor(AuthProvider.LOCAL);

        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        //añadimosesto para crear las tres listas por defecto
        String[] listasPorDefecto = {"Favoritas", "Por ver", "Vistas"};
        for (String nombre : listasPorDefecto) {
            Lista lista = new Lista();
            lista.setNombre(nombre);
            lista.setUsuario(nuevoUsuario);
            listaRepository.save(lista);
        }

        return nuevoUsuario;
    }

    
    public AuthResponse login(String email, String password) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(usuario);

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail()
        );
    }

}
