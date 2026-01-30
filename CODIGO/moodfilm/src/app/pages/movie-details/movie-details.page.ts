import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MovieService } from 'src/app/services/MovieService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  // al ser standalone importamos todo lo que use el html
  imports: [IonicModule, CommonModule, DatePipe]
})

export class MovieDetailsPage implements OnInit {

  movie: any;                                         // peli seleccionada
  loading = true;                                     // controla el estado de carga
  readonly IMAGE_BASE_URL = environment.tmdbImageUrl;   //obtenemos la url de las imágenes desde enviroment
  
  constructor(
    private route: ActivatedRoute,  // para leer el id desde la url
    private router: Router,         // para poder navegar
    private movieService: MovieService
  ) { }

  ngOnInit() {
    // obtenermos el id de la peli desde los queryParams
    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.loadMovieDetails(+id);
    } else {
      // Si no llega el id, volvemos a la pagina discover
      console.error('No se recibió ID de película');
      this.router.navigate(['/discover']);
    }
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/img/no-poster.png'; // fallback
    }
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }

  //cargamos los detalles completos de la película usando async y await 
  async loadMovieDetails(id: number) {
    try {
      this.loading = true;
      this.movie = await this.movieService.getMovieDetails(id);

    } catch (error) {
      console.error('Error al cargar detalles', error);
    } finally {
      this.loading = false;
    }
  }


  //Devuelve los géneros en formato texto:
  /*Si movie existe y movie.genres también, sigue adelante.
  Si no, devuelve undefined. Rrecorre el array y solo coge el nombre de cada género.
  ?? '' es el valor por defecto: si no hay géneros, devuelve cadena vacía '' */

  get genresText(): string {
    return this.movie?.genres?.map((g: { id: number; name: string }) => g.name).join(', ') ?? '';
  }



  //métodos provisionales, solo para probar mientras no tengamos la api ni la BD
  //datos de prueba:
  comments = [
    { user: 'Ana', text: '¡Me encantó!' },
    { user: 'Luis', text: 'Buena película, la recomiendo.' }
  ];

  addToList(movie: any) {
    // Llamada a tu servicio: movieService.addToList(movie.id)
    console.log('Añadir a lista:', movie.title);
  }

  openCommentModal(movie: any) {
    // Abrir modal para escribir comentario
    console.log('Abrir modal para comentar:', movie.title);
  }



}


