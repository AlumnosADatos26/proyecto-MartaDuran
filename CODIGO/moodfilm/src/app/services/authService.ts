import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    saveToken(token: string) {
        localStorage.setItem('token', token);
        localStorage.removeItem('guest');
        localStorage.removeItem('userId');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setGuest() {
        localStorage.setItem('guest', 'true');
    }

    isGuest(): boolean {
        return localStorage.getItem('guest') === 'true';
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('guest');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
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

}