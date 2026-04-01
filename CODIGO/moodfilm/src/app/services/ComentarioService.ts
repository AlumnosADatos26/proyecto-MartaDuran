import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private apiUrl = `${environment.apiBaseUrl}/comentarios`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private getHeaders() {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  //obtener comentarios de una película
  getComentariosPorPeli(tmdbId: number): Promise<any[]> {
    const userId = this.auth.getUserId();
    const esInvitado = this.auth.isGuest();

    //Si está logueado, manda su id para que el backend filtre bien
    const params = (!esInvitado && userId) ? `?usuarioId=${userId}` : '';

    return firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/pelicula/${tmdbId}${params}`, {
        headers: this.getHeaders()
      })
    );
  }

  //crear comentario (añadimos tituloPelicula y esPublico)
  async guardarComentario(texto: string, tmdbId: number, tituloPelicula: string, esPublico: boolean): Promise<any> {
    const userId = this.auth.getUserId();

    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const body = {
      texto: texto,
      tmdbId: tmdbId,
      tituloPelicula: tituloPelicula, 
      esPublico: esPublico,           
      usuario: { id: userId }
    };

    return firstValueFrom(
      this.http.post(this.apiUrl, body, {
        headers: this.getHeaders()
      })
    );
  }

  //eliminar comentario
  eliminarComentario(id: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders()
      })
    );
  }

  //obtener comentarios de un usuario (para "Mis comentarios" en perfil)
  getComentariosPorUsuario(userId: number): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}`, {
        headers: this.getHeaders()
      })
    );
  }

}