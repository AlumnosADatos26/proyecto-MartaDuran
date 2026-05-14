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
import com.example.apiMoodFilm.model.TokenRecuperacion;
import com.example.apiMoodFilm.repository.ListaRepository;
import com.example.apiMoodFilm.repository.TokenRecuperacionRepository;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ListaRepository listaRepository;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final TokenRecuperacionRepository tokenRecuperacionRepository;
    private final EmailService servicioEmail;

    public AuthService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            ListaRepository listaRepository,
            GoogleTokenVerifier googleTokenVerifier,
            TokenRecuperacionRepository tokenRecuperacionRepository,
            EmailService servicioEmail) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.listaRepository = listaRepository;
        this.googleTokenVerifier = googleTokenVerifier;
        this.tokenRecuperacionRepository = tokenRecuperacionRepository;
        this.servicioEmail = servicioEmail;
    }

    public Usuario register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            // comprobamos si ya existe con google 
            Usuario existente = usuarioRepository.findByEmail(request.getEmail()).orElse(null);
            if (existente != null && existente.getProveedor() == AuthProvider.GOOGLE) {
                throw new RuntimeException("Este email ya está registrado con Google. Usa el botón 'Continuar con Google'.");
            }
            throw new RuntimeException("El email ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setProveedor(AuthProvider.LOCAL);

        Usuario nuevoUsuario = usuarioRepository.save(usuario);

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
                usuario.getEmail(),
                usuario.getFotoPerfil(),
                usuario.getBio(),
                usuario.getGeneroFavorito()
        );
    }

    public AuthResponse loginWithGoogle(String googleToken) {
        GoogleTokenVerifier.GoogleUserInfo userInfo = googleTokenVerifier.verify(googleToken);

        String email = userInfo.email;
        String nombre = userInfo.name;
        String foto = userInfo.picture;

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario == null) {
            usuario = new Usuario();
            usuario.setEmail(email);

            //generamos un username único para evitar duplicados
            String baseUsername = email.split("@")[0];
            String username = baseUsername;

            //y si ya existe ese username, añadimos numeros al final hasta que sea único
            int intento = 1;
            while (usuarioRepository.existsByUsername(username)) {
                username = baseUsername + intento;
                intento++;
            }

            usuario.setUsername(username);
            usuario.setFotoPerfil(null);
            usuario.setProveedor(AuthProvider.GOOGLE);
            usuario.setPassword("");

            Usuario nuevoUsuario = usuarioRepository.save(usuario);

            String[] listasPorDefecto = {"Favoritas", "Por ver", "Vistas"};
            for (String nombreLista : listasPorDefecto) {
                Lista lista = new Lista();
                lista.setNombre(nombreLista);
                lista.setUsuario(nuevoUsuario);
                listaRepository.save(lista);
            }
            usuario = nuevoUsuario;

        } else if (usuario.getProveedor() == AuthProvider.LOCAL) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Este email ya está registrado con contraseña. Usa el login normal."
            );
        }

        String token = jwtUtil.generateToken(usuario);
        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getFotoPerfil(),
                usuario.getBio(),
                usuario.getGeneroFavorito()
        );
    }

    public void solicitarRecuperacion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        // respondemos igual aunque el email no exista (seguridad)
        if (usuario == null) {
            return;
        }

        if (usuario.getProveedor() == AuthProvider.GOOGLE) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Esta cuenta usa Google. Inicia sesión con el botón de Google."
            );
        }

        // borramos tokens anteriores del mismo usuario
        tokenRecuperacionRepository.deleteByUsuarioId(usuario.getId());

        String token = java.util.UUID.randomUUID().toString();
        TokenRecuperacion nuevoToken = new TokenRecuperacion(
                token,
                usuario,
                java.time.LocalDateTime.now().plusMinutes(15)
        );
        tokenRecuperacionRepository.save(nuevoToken);

        servicioEmail.enviarEmailRecuperacion(email, token);
    }

    public void restablecerPassword(String token, String nuevaPassword) {
        TokenRecuperacion tokenRecuperacion = tokenRecuperacionRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido o expirado"));

        if (tokenRecuperacion.isUsado()) {
            throw new RuntimeException("Este enlace ya fue utilizado");
        }

        if (tokenRecuperacion.getExpiracion().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("El enlace ha expirado. Solicita uno nuevo");
        }

        Usuario usuario = tokenRecuperacion.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        tokenRecuperacion.setUsado(true);
        tokenRecuperacionRepository.save(tokenRecuperacion);
    }

    
}

