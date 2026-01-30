import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';  // HttpClient
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // español

//Registramos el locale español globalmente
registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),   // inyección de HttpClient
  ]
});
