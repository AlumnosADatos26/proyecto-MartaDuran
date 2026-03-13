import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {

  //datos que el usuario escribe en el formulario
  username = '';
  email = '';
  password = '';
  passwordRepeat = '';
  //mensaje de error que se muestra si algo va mal
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }

  register() {
    //vemos que todos los campos esten rellenos
    if (!this.username || !this.email || !this.password || !this.passwordRepeat) {
      this.errorMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    //comprobamos que las dos contraseñas coincidan
    if (this.password !== this.passwordRepeat) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    this.errorMessage = '';

    //llamamos al backend para crear el usuario
    // Uusamos el endpoint POST /usuarios de sring boot
    this.http.post<any>('http://localhost:8080/auth/register', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res) => {
        //s el registro fue bien, vamos al login
        console.log('Usuario creado:', res);
        this.router.navigate(['/login']);
      },

      error: (err) => {
        //si el backend devuelve error(ej: email ya existe)
        console.error('Error al registrarse:', err);
        this.errorMessage = 'No se pudo crear la cuenta. El email o usuario ya existe.';
      }

    });
  }

  //volver a pantalla de login
  goToLogin() {
    this.router.navigate(['/login']);
  }

}