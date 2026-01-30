import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/MovieService';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, DatePipe]
})
export class SearchPage implements OnInit {
  nombrePeli = '';
  peliculas: any[] = [];
  searching = false;
  isLoading = false;
  showFilters = false;

  // filtros
  selectedGenre = '';
  selectedYear = '';
  selectedDuration = '';
  selectedRating = '';
  selectedMood = '';

  // datos para los filtros
  genres: any[] = [];
  years: number[] = [];

  // mapeamos los sentimientos a géneros 
  moodToGenres: any = {
    happy: [35, 10751, 10402], // Comedia, Familiar, Música
    sad: [18, 10749], // Drama, Romance
    excited: [28, 12, 878], // Acción, Aventura, Ciencia Ficción
    relaxed: [16, 10751, 14], // Animación, Familiar, Fantasía
    scared: [27, 53] // Terror, Thriller
  };

  constructor(
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadGenres();
    this.generateYears();
  }

  // hacemos una lista de años 
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 50; i--) {
      this.years.push(i);
    }
  }

  // cargamos los géneros desde TMDB
  async loadGenres() {
    try {
      const data: any = await this.movieService.getGenres();
      this.genres = data.genres || [];
    } catch (error) {
      console.error('Error cargando géneros:', error);
    }
  }

  // al escribir salen resultados
  async onSearchInput() {
    if (this.nombrePeli.trim().length >= 3) {
      await this.search();
    } else if (this.nombrePeli.trim().length === 0) {
      this.peliculas = [];
      this.searching = false;
    }
  }

  // búsqueda principal:
  async search() {
    const query = this.nombrePeli.trim();

    if (!query && !this.hasActiveFilters()) {
      this.peliculas = [];
      this.searching = false;
      return;
    }

    this.searching = true;
    this.isLoading = true;

    try {
      let res: any;

      // Si hay texto de búsqueda y filtros, combinamos los resultados
      if (query && this.hasActiveFilters()) {
        // primero busca por texto
        res = await this.movieService.searchMovies(query);
        this.peliculas = res.results || [];

        //luego aplica los filtros
        this.applyClientSideFilters();

      } else if (query) {
        // Solo búsqueda por texto
        res = await this.movieService.searchMovies(query);
        this.peliculas = res.results || [];

      } else {
        // si solo usa filtros:
        res = await this.movieService.discoverMovies(this.buildFilterParams());
        this.peliculas = res.results || [];
      }

    } catch (error) {
      console.error('Error buscando películas:', error);
      this.peliculas = [];
    } finally {
      this.isLoading = false;
    }
  }

  // aplicar filtros
  async applyFilters() {
    await this.search();
  }

  // construir parámetros de filtro para la api
  buildFilterParams() {
    const params: any = {};

    if (this.selectedGenre) {
      params.with_genres = this.selectedGenre;
    }

    if (this.selectedYear) {
      params.primary_release_year = this.selectedYear;
    }

    if (this.selectedRating) {
      params['vote_average.gte'] = this.selectedRating;
    }

    // Mood se traduce a géneros
    if (this.selectedMood && this.moodToGenres[this.selectedMood]) {
      const moodGenres = this.moodToGenres[this.selectedMood].join(',');
      params.with_genres = this.selectedGenre ?
        `${this.selectedGenre},${moodGenres}` : moodGenres;
    }

    // Duración (min)
    if (this.selectedDuration) {
      switch (this.selectedDuration) {
        case 'short':
          params['with_runtime.lte'] = 90;
          break;
        case 'medium':
          params['with_runtime.gte'] = 90;
          params['with_runtime.lte'] = 120;
          break;
        case 'long':
          params['with_runtime.gte'] = 120;
          break;
      }
    }

    return params;
  }

  // aplicar filtros del lado del cliente (cuando se combina búsqueda de texto + filtros)
  applyClientSideFilters() {
    let filtered = [...this.peliculas];

    // filtrar por género
    if (this.selectedGenre) {
      filtered = filtered.filter(peli =>
        peli.genre_ids && peli.genre_ids.includes(Number(this.selectedGenre))
      );
    }

    // filtrar por año
    if (this.selectedYear) {
      filtered = filtered.filter(peli =>
        peli.release_date && peli.release_date.startsWith(this.selectedYear.toString())
      );
    }

    // filtrar por puntuación
    if (this.selectedRating) {
      filtered = filtered.filter(peli =>
        peli.vote_average >= Number(this.selectedRating)
      );
    }

    // filtrar por sentimientos (mediante géneros)
    if (this.selectedMood && this.moodToGenres[this.selectedMood]) {
      const moodGenreIds = this.moodToGenres[this.selectedMood];
      filtered = filtered.filter(peli =>
        peli.genre_ids && peli.genre_ids.some((id: number) => moodGenreIds.includes(id))
      );
    }

    this.peliculas = filtered;
  }

  // verificamos que haya filtros activos
  hasActiveFilters(): boolean {
    return !!(
      this.selectedGenre ||
      this.selectedYear ||
      this.selectedDuration ||
      this.selectedRating ||
      this.selectedMood
    );
  }

  // limpiamos los filtros
  clearFilters() {
    this.selectedGenre = '';
    this.selectedYear = '';
    this.selectedDuration = '';
    this.selectedRating = '';
    this.selectedMood = '';
    this.nombrePeli = '';
    this.peliculas = [];
    this.searching = false;
  }

  // Toggle panel de filtros
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  // vemos los detalles de película usando queryParams
  verFicha(movie: any) {
    this.router.navigate(['/movie-details'], {
      queryParams: { id: movie.id }
    });
  }

  // url imagen
  getImageUrl(path: string) {
    return path ? `${environment.tmdbImageUrl}${path}` : 'assets/no-image.png';
  }
}