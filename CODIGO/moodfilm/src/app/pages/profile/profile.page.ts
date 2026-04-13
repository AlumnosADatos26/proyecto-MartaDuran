import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService';
import { ListaService } from 'src/app/services/ListaService';
import { addIcons } from 'ionicons';
import { personOutline, bookmarkOutline, filmOutline, chevronForwardOutline, logOutOutline, heart, checkmarkCircle, time, globeOutline, chevronDownOutline, chatbubblesOutline, cameraOutline } from 'ionicons/icons';
import { ComentarioService } from 'src/app/services/ComentarioService';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  username = '';
  email = '';
  listas: any[] = [];
  peliculasVistas = 0;
  peliculasFavoritas = 0;
  totalListas = 0;
  esInvitado = false;
  misComentarios: any[] = [];
  fotoPerfil: string | null = null;
  descripcion: string = '';
  generoFavorito: string = '';
  moodStats: { mood: string, emoji: string, count: number }[] = [];

  constructor(
    private auth: AuthService,
    private listaService: ListaService,
    private router: Router,
    private comentarioService: ComentarioService,
    private http: HttpClient
  ) {
    addIcons({
      personOutline, bookmarkOutline, filmOutline, chevronForwardOutline,
      logOutOutline, heart, checkmarkCircle, time, globeOutline, chevronDownOutline, chatbubblesOutline, cameraOutline });
  }

  ngOnInit() {
    // Suscripción a los cambios del servicio para refrescas los datos al instante
    this.auth.fotoActual$.subscribe(foto => this.fotoPerfil = foto);
    this.auth.bioActual$.subscribe(bio => this.descripcion = bio);
    this.auth.generoFavoritoActual$.subscribe(genero => this.generoFavorito = genero);

    this.username = this.auth.getUsername();
    const userId = this.auth.getUserId();

    if (userId && !this.auth.isGuest()) {
      this.http.get<any>(`http://localhost:8080/usuarios/${userId}/perfil`)
        .subscribe({
          next: (user) => {
            this.descripcion = user.bio || 'Sin descripción...';
            this.username = user.username;
          },

          error: (err) => console.error('Error al obtener perfil inicial', err)
        });
    }
  }

  ionViewWillEnter() {
    this.fotoPerfil = this.auth.isGuest() ? null : this.auth.getFotoPerfil();
    this.cargarPerfil();
    this.cargarDatosBackend();

  }

  cargarDatosBackend() {
    const userId = this.auth.getUserId();
    if (userId && !this.auth.isGuest()) {
      this.http.get<any>(`http://localhost:8080/usuarios/${userId}/perfil`)
        .subscribe({
          next: (user) => {
            this.descripcion = user.bio || '';
            this.generoFavorito = user.generoFavorito || '';
            this.username = user.username;

            //dincronizamos con el servicio/localstorage
            this.auth.saveBio(user.bio || '');
            this.auth.saveGeneroFav(user.generoFavorito || '');
            this.auth.saveUsername(user.username);

            console.log('Datos actualizados desde el servidor');
          },

          error: (err) => console.error('Error al conectar con el servidor', err)
        });
    }
  }

  async cargarPerfil() {
    this.esInvitado = this.auth.isGuest();

    if (this.esInvitado) {
      this.username = 'Usuario Invitado';
      this.email = 'Inicia sesión para ver tu perfil completo';
      this.descripcion = '';
      return;
    }

    this.username = this.auth.getUsername();
    this.descripcion = this.auth.getBio();
    this.email = this.auth.getEmail();

    const userId = this.auth.getUserId();
    if (!userId) {
      return;
    }

    try {
      this.listas = await this.listaService.getListas(userId);
      this.totalListas = this.listas.length;

      let vistas = 0;
      let favs = 0;

      for (const lista of this.listas) {
        const peliculas = await this.listaService.getPeliculasDeLista(lista.id);
        if (lista.nombre === 'Vistas') {
          vistas = peliculas.length;
        }
        if (lista.nombre === 'Favoritas') {
          favs = peliculas.length;
        }
      }

      this.peliculasVistas = vistas;
      this.peliculasFavoritas = favs;
      this.misComentarios = await this.comentarioService.getComentariosPorUsuario(userId);
      await this.cargarMoodStats(userId);
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
    this.username = '';
    this.email = '';
    this.listas = [];
    this.misComentarios = [];
    this.peliculasVistas = 0;
    this.peliculasFavoritas = 0;
    this.totalListas = 0;
    this.router.navigate(['/login']);
  }

  irAPelicula(tmdbId: number) {
    this.router.navigate(['/movie-details'], { queryParams: { id: tmdbId } });
  }


  irAMisComentarios() {
    this.router.navigate(['/my-comments']);
  }

 async cargarMoodStats(userId: string | number) {
  try {
    const peliculas = await this.http.get<any[]>(
      `http://localhost:8080/listas/usuario/${userId}/peliculas`
    ).toPromise();

    const moodMap: { [key: string]: number } = {
      feliz: 0, triste: 0, emocionado: 0, relajado: 0, miedo: 0
    };

    if (peliculas) {
      peliculas.forEach(p => {
        //pasamos a minusculas por si acaso el backend devuelve "Feliz"
        const moodKey = p.mood?.toLowerCase();
        if (moodKey && moodMap[moodKey] !== undefined) {
          moodMap[moodKey]++;
        }
      });
    }

    // definimos los 5  para que el grafico no baile  
    this.moodStats = [
      { mood: 'Feliz',      emoji: '😄', count: moodMap['feliz'] },
      { mood: 'Triste',     emoji: '😢', count: moodMap['triste'] },
      { mood: 'Emocionado', emoji: '🤩', count: moodMap['emocionado'] },
      { mood: 'Relajado',   emoji: '😌', count: moodMap['relajado'] },
      { mood: 'Miedo',      emoji: '😱', count: moodMap['miedo'] },
    ];

  } 
  catch (error) {
    console.error('Error al cargar mood stats:', error);
  }
}

get maxMood(): number {
  return Math.max(...this.moodStats.map(m => m.count), 1);
}

}
