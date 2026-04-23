import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ListaService } from 'src/app/services/ListaService';
import { environment } from 'src/environments/environment';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.page.html',
  styleUrls: ['./list-movies.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})

export class ListMoviesPage implements OnInit {

  //nombre de la lista que se mostrará en el titulo
  nombreLista = '';
  //id de la lista para pedir sus pelis al backend
  listaId = 0;
  //pelisculas  guardadas en esta lista
  peliculas: any[] = [];
  loading = true;
  readonly IMAGE_BASE_URL = environment.tmdbImageUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private listaService: ListaService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, trashOutline });
  }

  ngOnInit() {
    //recogemos el id y nombre de la lista desde los queryParams
    this.listaId = Number(this.route.snapshot.queryParamMap.get('listaId'));
    this.nombreLista = this.route.snapshot.queryParamMap.get('nombre') || 'Mi lista';

    this.cargarPeliculas();
  }

  async cargarPeliculas() {
    try {
      this.loading = true;
      this.peliculas = await this.listaService.getPeliculasDeLista(this.listaId);
    } catch (error) {
      console.error('Error al cargar películas de la lista:', error);
    } finally {
      this.loading = false;
    }
  }

  //all pulsar una pelicula vamos a su ficha
  verFicha(pelicula: any) {
    this.router.navigate(['/movie-details'], {
      queryParams: { id: pelicula.tmdbId }
    });
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/img/no-poster.png';
    }
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }

  goBack() {
    this.navCtrl.back();
  }


  async eliminarPelicula(peli: any) {

    const alert = await this.alertCtrl.create({
      header: '¿Quitar película?',
      message: `¿Seguro que quieres quitar "${peli.titulo}" de esta lista?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Quitar',
          handler: async () => {
            await this.listaService.deletePelicula(this.listaId, peli.id);
            this.listaService.listaActualizada$.next(); //notifica
            await this.cargarPeliculas();

            setTimeout(async () => {  // para esperarun poco para que el alert se cierre antes del toast
              const toast = await this.toastCtrl.create({
                message: `"${peli.titulo}" eliminada de la lista`,
                duration: 2000,
                position: 'bottom',
                cssClass: 'toast-moderno'
              });
              await toast.present();
            }, 400);
          }
        }
      ],
      cssClass: 'alert-moderno'
    });

    await alert.present();
  }

  getListaClass(): string {
    const nombre = this.nombreLista.toLowerCase();
    if (nombre === 'favoritas') return 'lista-favoritas';
    if (nombre === 'vistas') return 'lista-vistas';
    if (nombre === 'por ver') return 'lista-por-ver';
    return 'lista-custom';
  }


}