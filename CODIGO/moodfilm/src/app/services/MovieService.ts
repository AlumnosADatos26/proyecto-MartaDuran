import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComentarioService } from 'src/app/services/ComentarioService';
import { AuthService } from './authService';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(
    private http: HttpClient,
    private comentarioService: ComentarioService,
    public auth: AuthService,
    private toastCtrl: ToastController
  ) { }

  comentarios: any[] = [];
  nuevoComentario: string = '';
  esPublico: boolean = true;

  getPopularMovies(page = 1): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/populares?page=${page}`;
    return firstValueFrom(this.http.get(url));
  }

  getMovieDetails(id: number): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/${id}`;
    return firstValueFrom(this.http.get(url));
  }

  searchMovies(query: string, page = 1): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/buscar?query=${query}&page=${page}`;
    return firstValueFrom(this.http.get(url));
  }

  getGenres(): Promise<any> {
    const url = `${environment.apiBaseUrl}/tmdb/generos`;
    return firstValueFrom(this.http.get(url));
  }

  discoverMovies(filters: any = {}): Promise<any> {
    let queryString = '';

    for (const key of Object.keys(filters)) {
      const value = filters[key];
      queryString += '&' + key + '=' + value;
    }

    const url = environment.apiBaseUrl + '/tmdb/discover?' + queryString;
    return firstValueFrom(this.http.get(url));
  }

  async getBestTrailer(movieId: number): Promise<any | null> {
    const url = `${environment.apiBaseUrl}/tmdb/${movieId}/videos`;
    const res: any = await firstValueFrom(this.http.get(url));
    const videos = res.results || [];

    if (!videos.length) return null;

    let trailer = videos.find((v: any) =>
      v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'es'
    );

    if (!trailer) {
      trailer = videos.find((v: any) =>
        v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'en'
      );
    }

    if (!trailer) {
      trailer = videos.find((v: any) =>
        v.site === 'YouTube' && v.type === 'Trailer'
      );
    }

    if (!trailer) {
      trailer = videos.find((v: any) => v.site === 'YouTube');
    }

    return trailer || null;
  }

  //cargar comentarios
  async cargarComentarios(tmdbId: number) {
    try {
      //el backend ya devuelve solo lo que debe ver este usuario
      this.comentarios = await this.comentarioService.getComentariosPorPeli(tmdbId);
    }
    catch (error) {
      console.error('Error al cargar comentarios', error);
    }
  }

  //enviar comentario
  async enviarComentario(texto: string, tmdbId: number, tituloPelicula: string, esPublico: boolean) {
    try {
      // Llamamos al ComentarioService pasándole todos los datos
      await this.comentarioService.guardarComentario(texto, tmdbId, tituloPelicula, esPublico);
      //desspués de guardar, recargamos la lista para que aparezca el nuevo
      await this.cargarComentarios(tmdbId);
    } 
    catch (error) {
      console.error('Error en MovieService al enviar:', error);
      throw error; //re-lanzamos el error para que la página muestre el toasr rojo deerror
    }
  }


  //eliminar comentario
  async eliminarComentario(id: number, tmdbId: number) {
    await this.comentarioService.eliminarComentario(id);
    await this.cargarComentarios(tmdbId);
  }


}