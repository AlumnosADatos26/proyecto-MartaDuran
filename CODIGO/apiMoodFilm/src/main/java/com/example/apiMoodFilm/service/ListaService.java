package com.example.apiMoodFilm.service;

import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.repository.ListaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListaService {

    private final ListaRepository listaRepository;

    public ListaService(ListaRepository listaRepository) {
        this.listaRepository = listaRepository;
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
