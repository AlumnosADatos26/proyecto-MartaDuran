import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ResetPasswordPage implements OnInit {

  token = '';
  nuevaPassword = '';
  confirmarPassword = '';
  errorMessage = '';
  exito = false;
  cargando = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ lockClosedOutline });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'Enlace inválido. Solicita uno nuevo.';
    }
  }

  resetear() {
    if (!this.nuevaPassword || !this.confirmarPassword) {
      this.errorMessage = 'Rellena ambos campos.';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.nuevaPassword.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.errorMessage = '';
    this.cargando = true;

    this.http.post<any>('http://localhost:8080/auth/reset-password', {
      token: this.token,
      nuevaPassword: this.nuevaPassword
    }).subscribe({
      next: () => {
        this.exito = true;
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.cargando = false;
        this.errorMessage = err?.error?.message || 'Error al restablecer la contraseña';
      }
    });
  }
}