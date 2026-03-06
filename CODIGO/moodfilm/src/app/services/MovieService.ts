import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  //obtenemos pelis más recientes y populares
  getPopularMovies(page = 1): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/populares?page=${page}`;
    return firstValueFrom(this.http.get(url));
  }

  //obtenemos los detalles de una pelicula concreta
  getMovieDetails(id: number): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/${id}`;
    return firstValueFrom(this.http.get(url));
  }

  // busca pelicula por titulo
  searchMovies(query: string, page = 1): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/buscar?query=${query}&page=${page}`;
    return firstValueFrom(this.http.get(url));
  }

  //obtiene la lista de generos disponibles
  getGenres(): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/generos`;
    return firstValueFrom(this.http.get(url));
  }

  //descubre pelis con filtros avanzados (genero, año, puntuación, idioma, etc.)
  discoverMovies(filters: any = {}): Promise<any> {
    //cnstruimos la url manualmente para que los puntos no se codifiquen
    let queryString = '';

    //recorremos cada filtro y lo añadimos a la url
    for (const key of Object.keys(filters)) {
      const value = filters[key];
      queryString += '&' + key + '=' + value;
    }

    const url = environment.apiBaseUrl + '/tmdb/discover?' + queryString;
    return firstValueFrom(this.http.get(url));
  }

  //devuelve el mejor trailer disponible
  async getBestTrailer(movieId: number): Promise<any | null> {
    const url = `${environment.apiBaseUrl}/tmdb/${movieId}/videos`;
    const res: any = await firstValueFrom(this.http.get(url));
    const videos = res.results || [];

    if (!videos.length) {
      return null;
    }

    //trailer en español
    let trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'es');

    //en ingles
    if (!trailer) {
      trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'en');
    }
    //culaquiera trailer de yt
    if (!trailer) {
      trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    }
    //cualquier video de yt
    if (!trailer) {
      trailer = videos.find((v: any) => v.site === 'YouTube');
    }

    return trailer || null;
  }
}