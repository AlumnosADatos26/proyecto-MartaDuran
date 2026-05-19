import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'list-movies',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/list-movies/list-movies.page').then(m => m.ListMoviesPage)
  },
  {
    path: 'movie-details',
    loadComponent: () =>
      import('./pages/movie-details/movie-details.page').then(m => m.MovieDetailsPage)
  },
  {
    path: 'my-comments',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-comments/my-comments.page').then(m => m.MyCommentsPage)
  },
  {
    path: 'edit-profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then(m => m.EditProfilePage)
  },
  {
    path: 'my-lists',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-lists/my-lists.page').then(m => m.MyListsPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage)
  }

];