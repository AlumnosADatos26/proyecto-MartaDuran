import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService';
import { ListaService } from 'src/app/services/ListaService';
import { addIcons } from 'ionicons';
import { personOutline, bookmarkOutline, filmOutline, chevronForwardOutline, logOutOutline, heart, checkmarkCircle, time, globeOutline, chevronDownOutline } from 'ionicons/icons';
import { ComentarioService } from 'src/app/services/ComentarioService';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DatePipe]
})

export class ProfilePage implements OnInit {

  //dtos del usuario
  username = '';
  email = '';
  //listas del usuario
  listas: any[] = [];
  //estadísticas
  peliculasVistas = 0;
  peliculasFavoritas = 0;
  totalListas = 0;
  //controlamos si es invitado
  esInvitado = false;
  //para los comentarios del usuario:
  misComentarios: any[] = [];
  mostrarComentarios: boolean = false; 

  constructor(
    private auth: AuthService,
    private listaService: ListaService,
    private router: Router,
    private comentarioService: ComentarioService,
  ) {
    addIcons({
      personOutline, bookmarkOutline, filmOutline, chevronForwardOutline,
      logOutOutline, heart, checkmarkCircle, time, globeOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.cargarPerfil();
  }

  ionViewWillEnter() {
    this.cargarPerfil();
  }

  async cargarPerfil() {

    this.esInvitado = this.auth.isGuest();

    if (this.esInvitado) {
      this.username = 'Usuario Invitado';
      this.email = 'Inicia sesión para ver tu perfil completo';
      return;
    }

    //datos basicos del usuario desde localStorage
    this.username = this.auth.getUsername();
    this.email = this.auth.getEmail();

    const userId = this.auth.getUserId();
    if (!userId) return;

    try {
      //cargamos las listas
      this.listas = await this.listaService.getListas(userId);
      this.totalListas = this.listas.length;

      //calculamos estadísticas
      for (const lista of this.listas) {
        const peliculas = await this.listaService.getPeliculasDeLista(lista.id);
        if (lista.nombre === 'Vistas') {
          this.peliculasVistas = peliculas.length;
        }
        if (lista.nombre === 'Favoritas') {
          this.peliculasFavoritas = peliculas.length;
        }
      }

      this.misComentarios = await this.comentarioService.getComentariosPorUsuario(userId);

    }
    catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  }

  verLista(lista: any) {
    this.router.navigate(['/list-movies'], {
      queryParams: { listaId: lista.id, nombre: lista.nombre }
    });
  }

  editarPerfil() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  irAPelicula(tmdbId: number) {
    this.router.navigate(['/movie-details'], { queryParams: { id: tmdbId } });
  }

}