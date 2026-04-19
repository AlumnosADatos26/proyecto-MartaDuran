import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/MovieService';
import { environment } from 'src/environments/environment';
import { diceOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
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

  surpriseMovie: any = null;
  readonly moodToGenres: any = {
    feliz: [35, 10751, 16],
    triste: [18, 10749],
    emocionado: [28, 12, 878],
    relajado: [16, 35],
    miedo: [27, 53]
  };
  isSurprising = false;

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({ diceOutline });
  }

  ngOnInit() {
    this.loadMovies();
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/img/no-poster.png'; // fallback
    }
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }


  //Carga las películas populares desde el servicio
  async loadMovies() {
    try {
      this.loading = true;
      const respuesta = await this.movieService.getPopularMovies(this.page);
      // Si ya hay películas, agregamos las nuevas al array
      this.movies = [...this.movies, ...respuesta.results];

    } catch (error) {
      console.error('Error al cargar películas', error);
    } finally {
      this.loading = false;
    }
  }


  isValidMovie(movie: any): boolean {
    return (
      movie.poster_path &&
      movie.title &&
      movie.title.trim().length > 0 &&
      movie.vote_average > 0 &&
      movie.release_date
    );
  }


  //Al hacer click en una película:
  //navegamos a la pág de detalles pasando el ig por queryparams
  verFicha(movie: any) {
    if (!movie) {
      return;
    }

    const movieId = movie.id;
    this.surpriseMovie = null;

    this.router.navigate(['/movie-details'], {
      queryParams: { id: movieId }
    });
  }


  // Carga la siguiente página de películas
  async loadMoreMovies() {
    this.page++;          // pasamos a la siguiente página
    await this.loadMovies();
  }


irAMoodSearch(mood: string) {
  this.router.navigate(['/tabs/search'], { 
    queryParams: { mood },
    replaceUrl: true  //reemplazamos la url en vez de apilarla
  });
}

  
  async sorprendeme() {
    //si ya estamos buscando una peli, salimos para evitar clics dobles
    if (this.isSurprising) {
      return;
    }

    const moods = ['feliz', 'triste', 'emocionado', 'relajado', 'miedo'];
    const moodAleatorio = moods[Math.floor(Math.random() * moods.length)];
    const generos = this.moodToGenres[moodAleatorio].join(',');
    const paginaAleatoria = Math.floor(Math.random() * 5) + 1;

    try {
      this.isSurprising = true; //bloqueamos el botn

      const res = await this.movieService.discoverMovies({
        with_genres: generos,
        'vote_count.gte': '100',
        include_adult: 'false',
        page: paginaAleatoria
      });

      const validas = res.results.filter((m: any) =>
        m.poster_path && m.vote_average > 0 && m.overview
      );

      if (validas.length > 0) {
        //elegimos una peli al azar de las válidas
        this.surpriseMovie = validas[Math.floor(Math.random() * validas.length)];
      }
    }
    catch (error) {
      console.error('Error al sorprender:', error);
    }
    finally {
      // Liberamos el botón tanto si sale bien como si hay error
      this.isSurprising = false;
    }
  }


  cerrarSorpresa() {
    this.surpriseMovie = null;
  }

}
