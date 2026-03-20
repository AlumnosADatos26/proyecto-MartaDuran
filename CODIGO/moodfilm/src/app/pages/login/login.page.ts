import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {

  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  // login local con email y contraseña
  login() {
    this.http.post<any>('http://localhost:8080/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
          this.auth.saveUserId(res.userId);
          this.auth.saveUserInfo(res.username, res.email);
        this.router.navigate(['/tabs/discover']);
      },
      error: (err) => {
        console.error('Error al iniciar sesion:', err);
        alert('Email o contraseña incorrectos');
      }
    });
  }

  // Login con google (falta implementarlo)
  loginGoogle() {
    alert('Login con Google próximamente');
  }

  // entrar sin cuenta
  loginGuest() {
    this.auth.setGuest();
    this.router.navigate(['/tabs/discover']);
  }

  //ir a la pantalla de registro
  goToRegister() {
    this.router.navigate(['/register']);
  }
}