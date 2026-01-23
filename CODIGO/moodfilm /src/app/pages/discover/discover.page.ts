import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/MovieService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})

export class DiscoverPage {

  movies: any[] = [];     // lista de películas que se mostrarán 
  page = 1;               // Página actual (para la paginación)
  loading = true;         // controla el mensaje de carga
  readonly IMAGE_BASE_URL = environment.tmdbImageUrl;

  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit() {
    this.loadMovies();
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/img/no-poster.png'; // devuelve una imagen por defecto si no la encuentra
    }
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }


  //Carga las películas populares desde el servicio
  async loadMovies() {
    try {
      this.loading = true;
      const respuesta = await this.movieService.getPopularMovies(this.page);
      // guardamos solo el array de resultados
      this.movies = respuesta.results;

    } catch (error) {
      console.error('Error al cargar películas', error);
    } finally {
      this.loading = false;
    }
  }


  //Al hacer click en una película:
  //navegamos a la página de detalles pasando el ID por queryParams
  verFicha(movie: any) {
    this.router.navigate(
      ['/movie-details'],
      { queryParams: { id: movie.id } }
    );
  }

  // Carga la siguiente página de películas
  async loadMoreMovies() {
    this.page++;          // pasamos a la siguiente página
    await this.loadMovies();
  }


}
