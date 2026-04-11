package com.example.apiMoodFilm.controller;

import org.springframework.web.bind.annotation.*;
import com.example.apiMoodFilm.dto.UsuarioDTO;
import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:8100")//prmite peticiones desde ionic 
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    //registro del usuario(mantiene la creación de listas):
    @PostMapping
    public UsuarioDTO crearUsuario(@RequestBody Usuario usuario) {
        Usuario u = usuarioService.guardar(usuario);
        return new UsuarioDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFechaRegistro());
    }

    //obtener todos los usuarios:
    @GetMapping
    public List<UsuarioDTO> obtenerUsuarios() {
        return usuarioService.obtenerTodos()
                .stream()
                .map(u -> new UsuarioDTO(u.getId(), u.getUsername(), u.getEmail(), u.getFechaRegistro()))
                .collect(Collectors.toList());
    }

    //esto permite que  /usuarios/7 y /usuarios/7/perfil ambos funcionen
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioSimple(@PathVariable Long id) {
        return obtenerPerfil(id);
    }

    //acualización del perfil completo:
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPerfil(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        try {
            //buscamos el usuario real en la base de datos
            Usuario usuarioBD = usuarioService.obtenerPorId(id);

            if (usuarioBD == null) {
                return ResponseEntity.notFound().build();
            }

            //actualizamos los campos básicos:
            usuarioBD.setUsername(dto.getUsername());
            usuarioBD.setFotoPerfil(dto.getFotoPerfil());
            usuarioBD.setBio(dto.getBio());
            usuarioBD.setGeneroFavorito(dto.getGeneroFavorito());
            //solo actualizamos la contraseña si el usuario escribió una nueva
            if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
                usuarioBD.setPassword(passwordEncoder.encode(dto.getPassword()));
            }

            //guardamos usando el método de actualización del service (que no crea listas nuevas)
            usuarioService.actualizar(usuarioBD);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar: " + e.getMessage());
        }
    }

    //actualizar solo la foto:
    @PutMapping("/{id}/fotoPerfil")
    public ResponseEntity<?> actualizarFoto(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        try {
            String foto = body.get("fotoPerfil");
            usuarioService.actualizarFotoPerfil(id, foto);
            return ResponseEntity.ok().build();
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar foto");
        }
    }

    //obtenemos el perfil completo:
    @GetMapping("/{id}/perfil")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long id) {
        Usuario u = usuarioService.obtenerPorId(id);

        //validamos que exisat en la bd
        if (u == null) {
            return ResponseEntity.notFound().build();
        }

        java.util.Map<String, Object> perfil = new java.util.HashMap<>();
        perfil.put("username", u.getUsername());
        perfil.put("email", u.getEmail());
        perfil.put("fotoPerfil", u.getFotoPerfil());
        perfil.put("bio", u.getBio());
        perfil.put("generoFavorito", u.getGeneroFavorito());
        perfil.put("proveedor", u.getProveedor());

        return ResponseEntity.ok(perfil);
    }

}
