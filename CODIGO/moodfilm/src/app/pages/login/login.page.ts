import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authService';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

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
  private returnUrl: string = '/tabs/discover';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController

  ) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  //limpiamos los campos y recogemos returnUrl cada vez que se entra
  ionViewWillEnter() {
    this.email = '';
    this.password = '';
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/tabs/discover';
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
        this.auth.saveBio(res.bio || '');
        this.auth.saveGeneroFav(res.generoFavorito || '');

        // siempre sincroniza, aunque sea null (limpia foto de sesión anterior)
        if (res.fotoPerfil) {
          this.auth.saveFotoPerfil(res.fotoPerfil);
        } 
        else {
          localStorage.removeItem('fotoPerfil'); //limpia si esta cuenta no tiene foto
        }

        let destino = this.returnUrl;
        if (destino.includes('movie-details')) {
          const separator = destino.includes('?') ? '&' : '?';
          destino = destino + separator + 'from=login';
        }
        this.navCtrl.navigateRoot(destino);
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