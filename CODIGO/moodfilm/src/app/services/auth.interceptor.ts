import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/authService'; // Ajusta la ruta a tu authService
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();

        //si tenemos token, clonamos la petición y le añadimos el header Bearer
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        //ypasamos la petición al siguiente paso y manejamos erroresglobales
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // si el servidor devuelve 401, el token seguramente expiró
                if (error.status === 401) {
                    console.error('Sesión expirada o token inválido. Redirigiendo al login...');
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}