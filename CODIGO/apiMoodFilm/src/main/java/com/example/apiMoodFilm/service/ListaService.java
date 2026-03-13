package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.model.ListaPelicula;
import com.example.apiMoodFilm.repository.ListaPeliculaRepository;
import com.example.apiMoodFilm.repository.ListaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListaService {

    private final ListaRepository listaRepository;
    private final ListaPeliculaRepository listaPeliculaRepository;

    public ListaService(ListaRepository listaRepository,
            ListaPeliculaRepository listaPeliculaRepository) {
        this.listaRepository = listaRepository;
        this.listaPeliculaRepository = listaPeliculaRepository;
    }

    public ListaPelicula agregarPelicula(Long listaId, ListaPelicula pelicula) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        pelicula.setLista(lista);
        return listaPeliculaRepository.save(pelicula);
    }

    public List<ListaPelicula> obtenerPeliculas(Long listaId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        return lista.getPeliculas();
    }

    public void eliminarPelicula(Long listaId, Long peliculaId) {
        ListaPelicula pelicula = listaPeliculaRepository.findById(peliculaId)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));
        listaPeliculaRepository.delete(pelicula);
    }
}
