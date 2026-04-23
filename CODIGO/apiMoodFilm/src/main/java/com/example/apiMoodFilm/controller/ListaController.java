package com.example.apiMoodFilm.controller;

import com.example.apiMoodFilm.dto.ListaDTO;
import com.example.apiMoodFilm.model.ListaPelicula;
import com.example.apiMoodFilm.service.ListaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/listas")
@CrossOrigin(origins = "http://localhost:8100", allowedHeaders = "*", methods = {RequestMethod.GET,
    RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ListaController {

    private final ListaService listaService;

    public ListaController(ListaService listaService) {
        this.listaService = listaService;
    }

    //añadir pelicula a una lista
    @PostMapping("/{listaId}/peliculas")
    public ListaPelicula agregarPelicula(@PathVariable Long listaId,
            @RequestBody ListaPelicula pelicula) {
        return listaService.agregarPelicula(listaId, pelicula);
    }

    //obtener todas las peliculas de una lista
    @GetMapping("/{listaId}/peliculas")
    public List<ListaPelicula> obtenerPeliculas(@PathVariable Long listaId) {
        return listaService.obtenerPeliculas(listaId);
    }

    //eliminar pelicula de una lista
    @DeleteMapping("/{listaId}/peliculas/{peliculaId}")
    public void eliminarPelicula(@PathVariable Long listaId,
            @PathVariable Long peliculaId) {
        listaService.eliminarPelicula(listaId, peliculaId);
    }

    // Obtener todas las listas de un usuario concreto
    @GetMapping("/usuario/{usuarioId}")
    public List<ListaDTO> obtenerListasDeUsuario(@PathVariable Long usuarioId) {
        return listaService.obtenerPorUsuario(usuarioId)
                .stream()
                .map(l -> new ListaDTO(l.getId(), l.getNombre(), l.getUsuario().getId()))
                .collect(java.util.stream.Collectors.toList());
    }

    //obtenemod todas las peliculas de un usuario con su mood (para el mapa emocional)
    @GetMapping("/usuario/{usuarioId}/peliculas")
    public List<ListaPelicula> obtenerPeliculasDeUsuario(@PathVariable Long usuarioId) {
        return listaService.obtenerPeliculasDeUsuario(usuarioId);
    }

    @PostMapping("/usuario/{usuarioId}")
    public ListaDTO crearLista(@PathVariable Long usuarioId,
            @RequestBody java.util.Map<String, String> body) {
        com.example.apiMoodFilm.model.Lista nuevaLista = listaService.crearLista(usuarioId, body.get("nombre"));
        return new ListaDTO(nuevaLista.getId(), nuevaLista.getNombre(), nuevaLista.getUsuario().getId());
    }

    @DeleteMapping("/{listaId}")
    public void eliminarLista(@PathVariable Long listaId) {
        listaService.eliminar(listaId);
    }

    @PutMapping("/{listaId}")
    public ListaDTO actualizarLista(@PathVariable Long listaId,
            @RequestBody java.util.Map<String, String> body) {
        com.example.apiMoodFilm.model.Lista listaActualizada = listaService.actualizarNombre(listaId, body.get("nombre"));
        return new ListaDTO(listaActualizada.getId(), listaActualizada.getNombre(), listaActualizada.getUsuario().getId());
    }

}
