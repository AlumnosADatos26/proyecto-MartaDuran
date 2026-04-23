package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.model.ListaPelicula;
import com.example.apiMoodFilm.model.Usuario;
import com.example.apiMoodFilm.repository.ListaPeliculaRepository;
import com.example.apiMoodFilm.repository.ListaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ListaService {

    private final ListaRepository listaRepository;
    private final ListaPeliculaRepository listaPeliculaRepository;

    public ListaService(ListaRepository listaRepository,
            ListaPeliculaRepository listaPeliculaRepository) {
        this.listaRepository = listaRepository;
        this.listaPeliculaRepository = listaPeliculaRepository;
    }

    //obtiene todas las listas de un usuario
    public List<Lista> obtenerPorUsuario(Long usuarioId) {
        return listaRepository.findByUsuarioId(usuarioId);
    }

    //añade una peli a una lista
    public ListaPelicula agregarPelicula(Long listaId, ListaPelicula pelicula) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));

        //comprobamos si la pelicula ya esta en esta lista
        boolean yaExiste = listaPeliculaRepository.existsByListaIdAndTmdbId(listaId, pelicula.getTmdbId());

        if (yaExiste) {
            throw new RuntimeException("Esta película ya está en la lista");
        }

        pelicula.setLista(lista);
        return listaPeliculaRepository.save(pelicula);
    }

    //ver peliculas de una lista
    public List<ListaPelicula> obtenerPeliculas(Long listaId) {
        return listaPeliculaRepository.findByListaId(listaId);
    }

    //elimina una peli de una lista
    public void eliminarPelicula(Long listaId, Long peliculaId) {
        listaPeliculaRepository.deleteById(peliculaId);
    }

    public Lista guardar(Lista lista) {
        return listaRepository.save(lista);
    }

    public List<Lista> obtenerTodas() {
        return listaRepository.findAll();
    }

    public Optional<Lista> obtenerPorId(Long id) {
        return listaRepository.findById(id);
    }

    public void eliminar(Long id) {
        listaRepository.deleteById(id);
    }

    public List<ListaPelicula> obtenerPeliculasDeUsuario(Long usuarioId) {
        List<Lista> listas = listaRepository.findByUsuarioId(usuarioId);
        return listas.stream()
                .flatMap(lista -> listaPeliculaRepository.findByListaId(lista.getId()).stream())
                .collect(java.util.stream.Collectors.toList());
    }

    public Lista crearLista(Long usuarioId, String nombre) {
        // evitamos nombres duplicados para el mismo usuario
        List<Lista> existentes = listaRepository.findByUsuarioId(usuarioId);
        boolean yaExiste = existentes.stream()
                .anyMatch(l -> l.getNombre().equalsIgnoreCase(nombre));
        if (yaExiste) {
            throw new RuntimeException("Ya tienes una lista con ese nombre");
        }

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);

        Lista lista = new Lista();
        lista.setNombre(nombre);
        lista.setUsuario(usuario);
        return listaRepository.save(lista);
    }

    public Lista actualizarNombre(Long listaId, String nuevoNombre) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));

        // validamos que el usuario no tenga otra lista con el mismo nombre
        boolean yaExiste = listaRepository.findByUsuarioId(lista.getUsuario().getId()).stream()
                .anyMatch(l -> l.getNombre().equalsIgnoreCase(nuevoNombre) && !l.getId().equals(listaId));

        if (yaExiste) {
            throw new RuntimeException("Ya tienes otra lista con ese nombre");
        }
        lista.setNombre(nuevoNombre);
        return listaRepository.save(lista);
    }

}
