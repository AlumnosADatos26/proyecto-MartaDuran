import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authService';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  private returnUrl: string = '/tabs/discover';
  private googleInitialized = false;

  ngOnInit() { }

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  ionViewWillEnter() {
    this.email = '';
    this.password = '';
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/tabs/discover';

    if (!this.googleInitialized) {
      google.accounts.id.initialize({
        client_id: '1015555906160-nk052b4objv9a1rnnvsgn6iouv1i66hr.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleResponse(response)
      });
      this.googleInitialized = true;
    }

    this.renderGoogleButton();
  }

  private renderGoogleButton() {
    const container = document.getElementById('google-btn-container');

    if (container) {
      container.innerHTML = '';
      google.accounts.id.renderButton(container, {
        type: 'standard',
        shape: 'rectangular',
        theme: 'outline',
        text: 'continue_with',
        size: 'large',
        locale: 'es',
        width: container.offsetWidth || 300
      });
    }
    else {
      setTimeout(() => this.renderGoogleButton(), 100);
    }
  }

  login() {
    this.http.post<any>('http://localhost:8080/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.auth.saveUserId(res.userId);
        this.auth.saveUserInfo(res.username, res.email);
        this.auth.saveBio(res.bio || '');
        this.auth.saveGeneroFav(res.generoFavorito || '');

        if (res.fotoPerfil) {
          this.auth.saveFotoPerfil(res.fotoPerfil);
        }
        else {
          localStorage.removeItem('fotoPerfil');
        }

        let destino = this.returnUrl;
        if (destino.includes('movie-details')) {
          const separator = destino.includes('?') ? '&' : '?';
          destino = destino + separator + 'from=login';
        }
        this.router.navigateByUrl(destino, { replaceUrl: true });
      },

      error: (err) => {
        console.error('Error al iniciar sesion:', err);
        alert('Email o contraseña incorrectos');
      }
    });
  }

  handleGoogleResponse(response: any) {
    const idToken = response.credential;

    this.http.post<any>('http://localhost:8080/auth/google', { token: idToken }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.auth.saveUserId(res.userId);
        this.auth.saveUserInfo(res.username, res.email);
        this.auth.saveBio(res.bio || '');
        this.auth.saveGeneroFav(res.generoFavorito || '');

        if (res.fotoPerfil) {
          this.auth.saveFotoPerfil(res.fotoPerfil);
        } else {
          localStorage.removeItem('fotoPerfil');
        }

        let destino = this.returnUrl;
        if (destino.includes('movie-details')) {
          const separator = destino.includes('?') ? '&' : '?';
          destino = destino + separator + 'from=login';
        }

        this.router.navigateByUrl(destino, { replaceUrl: true });
      },
      error: (err) => {
        console.error('Error login Google:', err);
        const mensaje = err?.error?.message || err?.error || 'Error al iniciar sesión con Google';
        alert(mensaje);
      }
    });
  }

  loginGuest() {
    this.auth.setGuest();
    this.router.navigate(['/tabs/discover']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}