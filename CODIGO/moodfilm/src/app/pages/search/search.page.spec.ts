import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient) {}

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
}
