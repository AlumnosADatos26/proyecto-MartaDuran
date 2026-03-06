package com.example.apiMoodFilm.controller;

import com.example.apiMoodFilm.service.TmdbService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tmdb")
@CrossOrigin
public class TmdbController {

    private final TmdbService tmdbService;

    public TmdbController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/populares")
    public Object getPopularMovies(@RequestParam(defaultValue = "1") int page) {
        return tmdbService.getPopularMovies(page);
    }

    @GetMapping("/{id}")
    public Object getMovieDetails(@PathVariable Long id) {
        return tmdbService.getMovieDetails(id);
    }

    @GetMapping("/buscar")
    public Object searchMovies(@RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        return tmdbService.searchMovies(query, page);
    }

    @GetMapping("/generos")
    public Object getGenres() {
        return tmdbService.getGenres();
    }

    @GetMapping("/discover")
    public Object discoverMovies(@RequestParam Map<String, String> allParams,
            @RequestParam(defaultValue = "1") int page) {
        Map<String, String> filters = new java.util.HashMap<>(allParams);
        filters.remove("page"); // evita que page aparezca dos veces en la url de tmdb
        return tmdbService.discoverMovies(filters, page);
    }

    @GetMapping("/{id}/videos")
    public Object getMovieVideos(@PathVariable Long id) {
        return tmdbService.getMovieVideos(id);
    }
}
