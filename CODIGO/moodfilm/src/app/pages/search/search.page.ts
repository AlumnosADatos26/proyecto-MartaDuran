import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/MovieService';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ionViewWillEnter() {
    const mood = this.route.snapshot.queryParams['mood'];
    console.log('ionViewWillEnter, mood en URL:', mood);

    if (mood) {
      this.selectedMood = mood;
      this.showFilters = true;
      this.search();
    } 
    else {
      //limpiamos todo
      this.selectedMood = null;
      this.selectedGenre = null;
      this.selectedDuration = null;
      this.peliculas = [];
      this.searching = false;
      this.showFilters = false;
    }
  }

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
      } 
      else {
        res = await this.movieService.discoverMovies({
          ...this.buildFilterParams(),
          page: this.currentPage
        });
      }

      this.totalPages = res.total_pages || 1;

      // resultados que llegan de la api:
      const resultadosNuevos = res.results || [];

      // lista con solo pelis con poster, votos y descripción
      const resultadosFiltrados = [];
      for (const movie of resultadosNuevos) {
        if (movie.poster_path && movie.vote_count > 5 && movie.overview) {
          resultadosFiltrados.push(movie);
        }
      }

      // evitamis duplicados: solo añadimos pelis que no estén ya en la lista
      for (const movie of resultadosFiltrados) {
        // buscamos si ya existe una peli con ese id
        const yaExiste = this.peliculas.find(p => p.id === movie.id);

        //si no existe la añadimos
        if (!yaExiste) {
          this.peliculas.push(movie);
        }
      }

    } catch (error) {
      console.error('Error buscando películas:', error);
    } finally {
      this.isLoading = false;
    }
  }

  buildFilterParams() {
    const params: { [key: string]: string } = {};

    //mood y genero son excluyentes, solo se usa uno de los dos
    if (this.selectedMood) {
      // el mood define los generos internamente
      const generosDelMood = this.moodToGenres[this.selectedMood] || [];
      if (generosDelMood.length > 0) {
        params['with_genres'] = generosDelMood.join(',');
      }

    } else if (this.selectedGenre) {
      //si no hay mood, usamos el género manual
      params['with_genres'] = this.selectedGenre;
    }

    //pero duración se combina con cualquiera de los dos sin problema:
    if (this.selectedDuration === 'corta') {
      params['with_runtime.lte'] = '90';
    } else if (this.selectedDuration === 'media') {
      params['with_runtime.gte'] = '90';
      params['with_runtime.lte'] = '120';
    } else if (this.selectedDuration === 'larga') {
      params['with_runtime.gte'] = '120';
    }

    params['vote_count.gte'] = '50';
    params['include_adult'] = 'false';

    return params;
  }

  applyClientSideFilters() {
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
    this.peliculas = [];
    this.searching = false;
    //aqui limpiamos la url para que al volver no recargue el mood
    this.router.navigate(['/tabs/search'], {
      queryParams: {},
      replaceUrl: true
    });
  }

}