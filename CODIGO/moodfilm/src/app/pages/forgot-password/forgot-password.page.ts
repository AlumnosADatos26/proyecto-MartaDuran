import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ForgotPasswordPage {

  email = '';
  enviado = false;
  cargando = false;

  constructor(private http: HttpClient, private router: Router, private alertCtrl: AlertController) {
    addIcons({ mailOutline });
  }

  validarEmail(email: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  enviar() {
    if (!this.email) {
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.presentAlert('Formato inválido', 'El correo introducido no tiene un formato correcto (ejemplo@correo.com).');
      return;
    }

    this.cargando = true;
    const headers = { 'Content-Type': 'application/json' };
    const body = { email: this.email };

    this.http.post('http://localhost:8080/auth/forgot-password', body, { headers })
      .subscribe({
        next: () => {
          this.enviado = true;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
          console.log("Error completo:", err);
          const msg = err?.error?.detail || err?.error?.message || 'No pudimos procesar la solicitud.';
          this.presentAlert('Error', msg);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }


  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: 'MoodFilm',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
      cssClass: 'alert-moderno'
    });
    await alert.present();
  }

}