import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private fotoSubject = new BehaviorSubject<string | null>(localStorage.getItem('fotoPerfil'));
    fotoActual$ = this.fotoSubject.asObservable();
    private bioSubject = new BehaviorSubject<string>(localStorage.getItem('bio') || '');
    bioActual$ = this.bioSubject.asObservable();
    private generoFavoritoSubject = new BehaviorSubject<string>(localStorage.getItem('generoFavorito') || '');
    generoFavoritoActual$ = this.generoFavoritoSubject.asObservable();


    saveToken(token: string) {
        localStorage.setItem('token', token);
        localStorage.removeItem('guest');
        localStorage.removeItem('userId');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isGuest(): boolean {
        return localStorage.getItem('guest') === 'true';
    }

    logout() {
        localStorage.clear();
        this.fotoSubject.next(null);
    }

    isLogged(): boolean {
        return !!localStorage.getItem('token') || this.isGuest();
    }


    //guRadamos el id del usuario al hacer login
    saveUserId(id: number) {
        localStorage.setItem('userId', id.toString());
    }

    //obtenemos el id del usuario guardado
    getUserId(): number | null {
        const id = localStorage.getItem('userId');
        return id ? parseInt(id) : null;
    }

    //guardamos nombre d usuario y email del usuario
    saveUserInfo(username: string, email: string) {
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);

    }

    getUsername(): string {
        return localStorage.getItem('username') || 'Usuario';
    }

    getEmail(): string {
        return localStorage.getItem('email') || '';
    }


    getFotoPerfil(): string | null {
        return localStorage.getItem('fotoPerfil');
    }

    saveFotoPerfil(foto: string | null) {
        if (foto) {
            localStorage.setItem('fotoPerfil', foto);
        } else {
            localStorage.removeItem('fotoPerfil');
        }
        this.fotoSubject.next(foto); // <--- ESTO es lo que refresca las pantallas
    }


    saveUsername(username: string) {
        localStorage.setItem('username', username);
    }

    setGuest() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('fotoPerfil');
        localStorage.setItem('guest', 'true')
        this.fotoSubject.next(null);
    }


    saveBio(bio: string) {
        localStorage.setItem('bio', bio);
        this.bioSubject.next(bio); //notifica el cambio inmediatamente
    }

    getBio(): string {
        return localStorage.getItem('bio') || '';
    }

    saveGeneroFav(generoFavorito: string) {
        localStorage.setItem('generoFavorito', generoFavorito);
        this.generoFavoritoSubject.next(generoFavorito); //notifica el cambio inmediatamente
    }

    getGeneroFav(): string {
        return localStorage.getItem('generoFavorito') || '';
    }
}