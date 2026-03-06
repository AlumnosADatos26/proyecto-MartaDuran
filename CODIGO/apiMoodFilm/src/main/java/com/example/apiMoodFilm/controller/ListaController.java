
package com.example.apiMoodFilm.controller;

import com.example.apiMoodFilm.dto.ListaDTO;
import com.example.apiMoodFilm.model.Lista;
import com.example.apiMoodFilm.service.ListaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/listas")
@CrossOrigin
public class ListaController {

    private final ListaService listaService;

    public ListaController(ListaService listaService) {
        this.listaService = listaService;
    }

    @PostMapping
    public ListaDTO crearLista(@RequestBody Lista lista) {
        Lista l = listaService.guardar(lista);
        return new ListaDTO(l.getId(), l.getNombre(), l.getUsuario().getId());
    }

    @GetMapping
    public List<ListaDTO> obtenerListas() {
        return listaService.obtenerTodas()
                .stream()
                .map(l -> new ListaDTO(l.getId(), l.getNombre(), l.getUsuario().getId()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ListaDTO obtenerListaPorId(@PathVariable Long id) {
        Lista l = listaService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));
        return new ListaDTO(l.getId(), l.getNombre(), l.getUsuario().getId());
    }

    @DeleteMapping("/{id}")
    public void eliminarLista(@PathVariable Long id) {
        listaService.eliminar(id);
    }
}
