import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { MovieService } from 'src/app/services/MovieService';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, playCircleOutline, personCircleOutline, lockClosedOutline, chatbubblesOutline,
  sendOutline, globeOutline, chatbubbleEllipsesOutline
} from 'ionicons/icons';
import { ListaService } from 'src/app/services/ListaService';
import { AuthService } from 'src/app/services/authService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DatePipe, FormsModule]
})
export class MovieDetailsPage implements OnInit {

  movie: any;
  loading = true;
  readonly IMAGE_BASE_URL = environment.tmdbImageUrl;
  trailerKey: string | null = null;
  esPublico: boolean = true;
  maxCaracteres = 700;
  comentariosMostrados = 4;
  private cameFromLogin = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public movieService: MovieService,
    private navCtrl: NavController,
    private listaService: ListaService,
    public auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      arrowBackOutline, playCircleOutline, personCircleOutline,
      lockClosedOutline, chatbubblesOutline, sendOutline,
      globeOutline, chatbubbleEllipsesOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    const from = this.route.snapshot.queryParamMap.get('from');
    this.cameFromLogin = from === 'login';

    if (id) {
      this.loadMovieDetails(+id);
    } else {
      this.router.navigate(['/discover']);
    }
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) return 'assets/img/no-poster.png';
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }

  async loadMovieDetails(id: number) {
    try {
      this.loading = true;
      this.movie = await this.movieService.getMovieDetails(id);
      await this.loadTrailer(id);
      await this.movieService.cargarComentarios(id);
    } catch (error) {
      console.error('Error al cargar detalles', error);
    } finally {
      this.loading = false;
    }
  }

  get genresText(): string {
    return this.movie?.genres?.map((g: { id: number; name: string }) => g.name).join(', ') ?? '';
  }

  get estaLogueado(): boolean {
    return !this.auth.isGuest() && this.auth.getUserId() !== null;
  }

  // Validación de autoría
  esAutor(comentarioUsuarioId: any): boolean {
    const userId = this.auth.getUserId();
    if (!this.estaLogueado || !userId) return false;
    return Number(comentarioUsuarioId) === Number(userId);
  }


  async loadTrailer(id: number) {
    const video = await this.movieService.getBestTrailer(id);
    this.trailerKey = video ? video.key : null;
  }

  openTrailer() {
    if (!this.trailerKey) return;
    window.open(`https://www.youtube.com/watch?v=${this.trailerKey}`, '_blank');
  }


  goBack() {
    if (this.cameFromLogin) {
      this.router.navigate(['/tabs/discover']);
    } else {
      this.navCtrl.back();
    }
  }

  irAlLogin() {
    //pasa la url  actual para volver aquí tras el login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  async enviarComentario(tmdbId: number, tituloPelicula: string) {
    if (!this.estaLogueado) {
      const alert = await this.alertCtrl.create({
        header: 'Inicia sesión',
        message: 'Debes iniciar sesión para comentar.',
        buttons: ['OK'], cssClass: 'alert-moderno'
      });
      await alert.present();
      return;
    }

    const texto = this.movieService.nuevoComentario.trim();

    if (texto.length === 0) {
      return;
    }

    try {
      await this.movieService.enviarComentario(texto, tmdbId, tituloPelicula, this.esPublico);
      this.movieService.nuevoComentario = '';
      this.esPublico = true;
    }

    catch (error) {
      console.error("Error al enviar comentario:", error);
      const toast = await this.toastCtrl.create({
        message: 'Error al publicar el comentario. Inténtalo de nuevo.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async eliminarComentario(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar comentario?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.movieService.eliminarComentario(id, this.movie.id);
          }
        }
      ],
      cssClass: 'alert-moderno'
    });
    await alert.present();
  }


  get comentariosVisibles() {
    return this.movieService.comentarios.slice(0, this.comentariosMostrados);
  }

  verMasComentarios() {
    this.comentariosMostrados += 4;
  }


  async addToList(movie: any) {
  const userId = this.auth.getUserId();
  const esInvitado = this.auth.isGuest();

  if (!userId || esInvitado) {
    const alert = await this.alertCtrl.create({
      header: 'Inicia sesión',
      message: 'Debes iniciar sesión para guardar películas en tus listas.',
      buttons: ['OK'],
      cssClass: 'alert-moderno'
    });
    await alert.present();
    return;
  }

  const listas = await this.listaService.getListas(userId);
  const inputs: any[] = listas.map((lista: any) => ({
    type: 'radio', label: lista.nombre, value: lista.id
  }));

  const alertLista = await this.alertCtrl.create({
    header: '¿A qué lista añadir?',
    inputs,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Aceptar',
        handler: async (listaId: any) => {
          if (!listaId) return false;

          const listaSeleccionada = listas.find((l: any) => l.id === listaId);
          const nombre = listaSeleccionada?.nombre?.toLowerCase();

          // Solo preguntamos mood en Vistas y Favoritas Y si la peli no está ya
          if (nombre === 'vistas' || nombre === 'favoritas') {
            const peliculas = await this.listaService.getPeliculasDeLista(listaId);
            const yaExiste = peliculas.some((p: any) => p.tmdbId === movie.id);

            if (yaExiste) {
              // Ya está, guardamos sin preguntar mood (el backend lanzará error igual)
              this.guardarEnLista(movie, listaId, null);
            } else {
              this.elegirMood(movie, listaId);
            }
          } else {
            this.guardarEnLista(movie, listaId, null);
          }
          return true;
        }
      }
    ],
    cssClass: 'alert-moderno'
  });

  await alertLista.present();
}


  async elegirMood(movie: any, listaId: number) {

    const moods = [
      { emoji: '😄', label: 'Felicidad', value: 'feliz' },
      { emoji: '😢', label: 'Tristeza', value: 'triste' },
      { emoji: '🤩', label: 'Emoción', value: 'emocionado' },
      { emoji: '😌', label: 'Tranquilidad', value: 'relajado' },
      { emoji: '😱', label: 'Miedo', value: 'miedo' },
    ];

    const alertMood = await this.alertCtrl.create({
      header: '¿Qué te hizo sentir?',
      message: 'Cuéntanos tu mood',
      inputs: moods.map(m => ({
        type: 'radio',
        label: `${m.emoji} ${m.label}`,
        value: m.value
      })),

      buttons: [
        {
          text: 'Sin mood',
          handler: () => { this.guardarEnLista(movie, listaId, null); }
        },
        {
          text: 'Guardar',
          handler: (mood) => { this.guardarEnLista(movie, listaId, mood || null); }
        }
      ],
      cssClass: 'alert-moderno'
    });

    await alertMood.present();
  }


  async guardarEnLista(movie: any, listaId: number, mood: string | null) {
    try {
      await this.listaService.addPelicula(listaId, {
        tmdbId: movie.id,
        titulo: movie.title,
        posterPath: movie.poster_path,
        mood: mood
      });

      const toast = await this.toastCtrl.create({
        message: `"${movie.title}" añadida a tu lista`,
        duration: 2000,
        position: 'bottom',
        cssClass: 'toast-moderno'
      });
      await toast.present();

    }
    catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Esta película ya está en esa lista',
        duration: 2000,
        position: 'bottom',
        cssClass: 'toast-moderno'
      });
      await toast.present();
    }
  }



}