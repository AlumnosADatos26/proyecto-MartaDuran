package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.model.ListaPelicula;
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
}
