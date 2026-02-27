import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/MovieService';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})

//esta clase cambiará bastante pq los filtros se harán desde la api cuando la cree
//está asi provisionalmente
export class SearchPage implements OnInit {

  nombrePeli = '';
  peliculas: any[] = [];
  searching = false;
  isLoading = false;
  showFilters = false;

  // filtros
  selectedGenre: string | null = null;
  selectedMood: string | null = null;
  selectedDuration: string | null = null;

  // géneros simplificados
  genres = [
    { id: '28', name: 'Acción' },
    { id: '35', name: 'Comedia' },
    { id: '18', name: 'Drama' },
    { id: '27', name: 'Terror' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Ciencia ficción' },
    { id: '16', name: 'Animación' },
    { id: '99', name: 'Documental' }
  ];

  // moods en español
  moodToGenres: any = {
    feliz: [35, 10751, 16],
    triste: [18, 10749],
    emocionado: [28, 12, 878],
    relajado: [16, 35],
    miedo: [27, 53]
  };

  // paginación
  currentPage = 1;
  totalPages = 1;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit() { }

  async onSearchInput() {
    if (this.nombrePeli.trim().length >= 3) {
      await this.search();
    } else if (this.nombrePeli.trim().length === 0) {
      this.peliculas = [];
      this.searching = false;
    }
  }

  async search(loadMore: boolean = false) {

    const query = this.nombrePeli.trim();

    if (!query && !this.hasActiveFilters()) {
      this.peliculas = [];
      this.searching = false;
      return;
    }

    if (!loadMore) {
      this.currentPage = 1;
      this.peliculas = [];
    }

    this.searching = true;
    this.isLoading = !loadMore;

    try {
      let res: any;

      if (query) {
        res = await this.movieService.searchMovies(query, this.currentPage);
      } else {
        res = await this.movieService.discoverMovies({
          ...this.buildFilterParams(),
          page: this.currentPage
        });
      }

      this.totalPages = res.total_pages || 1;

      const cleanResults = (res.results || []).filter((movie: any) =>
        movie.poster_path &&
        movie.vote_count > 5 &&
        movie.overview
      );

      this.peliculas = [...this.peliculas, ...cleanResults];

      // aplicar filtros cliente (duración y combinación)
      this.applyClientSideFilters();

    } catch (error) {
      console.error('Error buscando películas:', error);
    } finally {
      this.isLoading = false;
    }
  }

  buildFilterParams() {

    const params: any = {};
    let genresArray: string[] = [];

    if (this.selectedGenre) genresArray.push(this.selectedGenre);

    if (this.selectedMood && this.moodToGenres[this.selectedMood]) {
      genresArray = [...genresArray, ...this.moodToGenres[this.selectedMood].map((g: number) => g.toString())];
    }

    if (genresArray.length > 0) {
      params.with_genres = genresArray.join(',');
    }

    params['vote_count.gte'] = 50;
    params.include_adult = false;

    return params;
  }

applyClientSideFilters() {
  // este metodo queda vacío porque los filtros los aplicamos en el backend
  console.log("Filtros aplicados en backend:", {
    genre: this.selectedGenre,
    mood: this.selectedMood,
    duration: this.selectedDuration
  });
}

  hasActiveFilters(): boolean {
    return !!(this.selectedGenre || this.selectedDuration || this.selectedMood);
  }

  toggleGenre(id: string) {
    this.selectedGenre = this.selectedGenre === id ? null : id;
    this.search();
  }

  toggleMood(mood: string) {
    this.selectedMood = this.selectedMood === mood ? null : mood;
    this.search();
  }

  toggleDuration(duration: string) {
    this.selectedDuration = this.selectedDuration === duration ? null : duration;
    this.search();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  verFicha(movie: any) {
    this.router.navigate(['/movie-details'], {
      queryParams: { id: movie.id }
    });
  }

  getImageUrl(path: string) {
    return path ? `${environment.tmdbImageUrl}${path}` : 'assets/no-image.png';
  }

  async loadMore(event: any) {

    if (this.currentPage >= this.totalPages) {
      event.target.complete();
      return;
    }

    this.currentPage++;
    await this.search(true);

    event.target.complete();
  }

  applyFilters() {
    console.log("Filtros aplicados:", {
      genre: this.selectedGenre,
      mood: this.selectedMood,
      duration: this.selectedDuration
    });

    this.search();
  }

  clearFilters() {
    this.selectedGenre = null;
    this.selectedMood = null;
    this.selectedDuration = null;

    this.applyFilters();
  }
}