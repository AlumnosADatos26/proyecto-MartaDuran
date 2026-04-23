import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './authService';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  listaActualizada$ = new Subject<void>();

  // Cabeceras con el token JWT para peticiones autenticadas
  private getHeaders() {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener las listas de un usuario
  getListas(usuarioId: number): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/usuario/${usuarioId}`;
    return firstValueFrom(this.http.get(url, { headers: this.getHeaders() }));
  }

  // Obtener las películas de una lista concreta
  getPeliculasDeLista(listaId: number): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/${listaId}/peliculas`;
    return firstValueFrom(this.http.get(url, { headers: this.getHeaders() }));
  }

  // Añadir una película a una lista
  addPelicula(listaId: number, pelicula: any): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/${listaId}/peliculas`;
    return firstValueFrom(this.http.post(url, pelicula, { headers: this.getHeaders() }));
  }

  // Eliminar una película de una lista
  deletePelicula(listaId: number, peliculaId: number): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/${listaId}/peliculas/${peliculaId}`;
    return firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
  }

  crearLista(usuarioId: number, nombre: string): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/usuario/${usuarioId}`;
    return firstValueFrom(this.http.post(url, { nombre }, { headers: this.getHeaders() }));
  }

  eliminarLista(listaId: number): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/${listaId}`;
    return firstValueFrom(this.http.delete(url, { headers: this.getHeaders() }));
  }

  // editamos el nombre de una lista existente
  editarLista(listaId: number, nuevoNombre: string): Promise<any> {
    const url = `${environment.apiBaseUrl}/listas/${listaId}`;
    return firstValueFrom(
      this.http.put(url, { nombre: nuevoNombre }, { headers: this.getHeaders() })
    );
  }

}