import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';

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

  constructor(private http: HttpClient, private router: Router) {
    addIcons({ mailOutline });
  }

enviar() {
  if (!this.email) return;
  this.cargando = true;

  //añadimos esto para asegurar que enviamos json 
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
        console.log("ERROR COMPLETO:", err);
        alert(err?.error?.message || 'Error 400: El servidor no entiende la petición');
      }
    });
}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}