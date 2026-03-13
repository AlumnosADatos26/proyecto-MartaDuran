import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    saveToken(token: string) {
        localStorage.setItem('token', token);
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
    }

    isLogged(): boolean {
        return !!localStorage.getItem('token') || this.isGuest();
    }

}