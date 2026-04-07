import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then(m => m.routes)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'list-movies',
    loadComponent: () => import('./pages/list-movies/list-movies.page').then( m => m.ListMoviesPage)
  }, 
  {
    path: 'movie-details',
    loadComponent: () =>
      import('./pages/movie-details/movie-details.page').then(m => m.MovieDetailsPage)
  },  {
    path: 'my-comments',
    loadComponent: () => import('./pages/my-comments/my-comments.page').then( m => m.MyCommentsPage)
  }




];