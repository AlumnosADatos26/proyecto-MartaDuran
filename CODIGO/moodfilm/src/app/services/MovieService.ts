import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  // Obtiene películas mas recientes y populares
  getPopularMovies(page = 1): Promise<any> {
    const url = `${environment.tmdbBaseUrl}/movie/popular`;
    return firstValueFrom(
      this.http.get(url, {
        params: {
          api_key: environment.tmdbApiKey,
          language: 'es-ES',
          page: page.toString()
        }
      })
    );
  }

  // Obtiene los detalles de una película concreta
  getMovieDetails(id: number): Promise<any> {
    const url = `${environment.tmdbBaseUrl}/movie/${id}`;
    return firstValueFrom(
      this.http.get(url, {
        params: {
          api_key: environment.tmdbApiKey,
          language: 'es-ES'
        }
      })
    );
  }

  // Busca películas por título
  searchMovies(query: string, page = 1): Promise<any> {
    const url = `${environment.tmdbBaseUrl}/search/movie`;
    return firstValueFrom(
      this.http.get(url, {
        params: {
          api_key: environment.tmdbApiKey,
          language: 'es-ES',
          query,
          page: page.toString()
        }
      })
    );
  }

  // Obtiene la lista de géneros disponibles
  getGenres(): Promise<any> {
    const url = `${environment.tmdbBaseUrl}/genre/movie/list`;
    return firstValueFrom(
      this.http.get(url, {
        params: {
          api_key: environment.tmdbApiKey,
          language: 'es-ES'
        }
      })
    );
  }

  // Descubre películas con filtros avanzados (género, año, puntuación, idioma, etc.)
  discoverMovies(filters: any = {}, page = 1): Promise<any> {
    const url = `${environment.tmdbBaseUrl}/discover/movie`;
    
    return firstValueFrom(
      this.http.get(url, {
        params: {
          api_key: environment.tmdbApiKey,
          language: 'es-ES',
          page: page.toString(),
          ...filters
        }
      })
    );
  }
}