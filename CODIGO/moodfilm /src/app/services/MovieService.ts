import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) {}

  
   // Obtiene películas mas recientes y populares
  getPopularMovies(page = 1): Promise<any> {
    const url = `${environment.tmdbBaseUrl}/movie/popular`;
    return firstValueFrom(
      this.http.get(url, {
        params: {
          api_key: environment.tmdbApiKey,
          language: 'es-ES',
          page: page
        }
      })
    );
  }

  
  //Obtiene los detalles de una película concreta
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
}
