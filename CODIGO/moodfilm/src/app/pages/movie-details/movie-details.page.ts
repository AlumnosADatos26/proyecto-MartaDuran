import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { MovieService } from 'src/app/services/MovieService';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, playCircleOutline, personCircleOutline, lockClosedOutline, chatbubblesOutline, 
          sendOutline, globeOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
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
    if (id) {
      this.loadMovieDetails(+id);
    } else {
      console.error('No se recibió ID de película');
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
  async addToList(movie: any) {
    const userId = this.auth.getUserId();
    const esInvitado = this.auth.isGuest();
    if (!userId || esInvitado) {
      const alert = await this.alertCtrl.create({
        header: 'Inicia sesión',
        message: 'Debes iniciar sesión para guardar películas en tus listas.',
        buttons: ['OK'], cssClass: 'alert-moderno'
      });
      await alert.present();
      return;
    }
    const listas = await this.listaService.getListas(userId);
    const inputs: any[] = [];
    for (const lista of listas) {
      inputs.push({ type: 'radio', label: lista.nombre, value: lista.id });
    }
    const alert = await this.alertCtrl.create({
      header: '¿A qué lista añadir?',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Añadir',
          handler: async (listaId) => {
            if (!listaId) return;
            try {
              await this.listaService.addPelicula(listaId, {
                tmdbId: movie.id, titulo: movie.title, posterPath: movie.poster_path
              });
              setTimeout(async () => {
                const toast = await this.toastCtrl.create({
                  message: `"${movie.title}" añadida a tu lista`,
                  duration: 2000, position: 'bottom', cssClass: 'toast-moderno'
                });
                await toast.present();
              }, 300);
            } catch (error) {
              setTimeout(async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Esta película ya está en esa lista',
                  duration: 2000, position: 'bottom', cssClass: 'toast-moderno'
                });
                await toast.present();
              }, 300);
            }
          }
        }
      ],
      cssClass: 'alert-moderno'
    });
    await alert.present();
  }

  async loadTrailer(id: number) {
    const video = await this.movieService.getBestTrailer(id);
    this.trailerKey = video ? video.key : null;
  }

  openTrailer() {
    if (!this.trailerKey) return;
    window.open(`https://www.youtube.com/watch?v=${this.trailerKey}`, '_blank');
  }

  goBack() { this.navCtrl.back(); }

  irAlLogin() { this.router.navigate(['/login']); }

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
    await this.movieService.enviarComentario(tmdbId, tituloPelicula, this.esPublico);
    this.esPublico = true;
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
}