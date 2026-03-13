package com.example.apiMoodFilm.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TmdbService {

    private final String apiKey = "ef7e2eea6a70b4a7b8bb8c73cdf9d549"; // reemplaza con la clave TMDB
    private final String baseUrl = "https://api.themoviedb.org/3";
    private final RestTemplate restTemplate = new RestTemplate();

    // peliculas populares
    public Object getPopularMovies(int page) {
        String url = String.format("%s/movie/popular?api_key=%s&language=es-ES&page=%d",
                baseUrl, apiKey, page);
        return restTemplate.getForObject(url, Object.class);
    }

    //detalles de la peli
    public Object getMovieDetails(Long id) {
        String url = String.format("%s/movie/%d?api_key=%s&language=es-ES",
                baseUrl, id, apiKey);
        return restTemplate.getForObject(url, Object.class);
    }

    // buuscar por titulo
    public Object searchMovies(String query, int page) {
        String url = String.format("%s/search/movie?api_key=%s&language=es-ES&query=%s&page=%d",
                baseUrl, apiKey, query.replace(" ", "%20"), page);
        return restTemplate.getForObject(url, Object.class);
    }

    // lista de géneros
    public Object getGenres() {
        String url = String.format("%s/genre/movie/list?api_key=%s&language=es-ES",
                baseUrl, apiKey);
        return restTemplate.getForObject(url, Object.class);
    }

    //discorver con filtros
    public Object discoverMovies(Map<String, String> filters, int page) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%s/discover/movie?api_key=%s&language=es-ES&page=%d",
                baseUrl, apiKey, page));
        if (filters != null) {
            filters.forEach((k, v) -> {
                sb.append("&").append(k).append("=").append(v);
            });
        }
        String url = sb.toString();
        return restTemplate.getForObject(url, Object.class);
    }

    //vídeos, trailers
    public Object getMovieVideos(Long id) {
        String url = String.format("%s/movie/%d/videos?api_key=%s&language=es-ES",
                baseUrl, id, apiKey);
        return restTemplate.getForObject(url, Object.class);
    }
}
