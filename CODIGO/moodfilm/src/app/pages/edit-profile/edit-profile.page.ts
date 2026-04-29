import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AvatarSelectorComponent } from 'src/app/components/avatar-selector/avatar-selector.component';
import { addIcons } from 'ionicons';
import { personOutline, cameraOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditProfilePage implements OnInit {
  //Datos del perfil
  username = '';
  password = '';
  confirmPassword = '';
  fotoSeleccionada: string | null = null;
  bio = '';
  generoFavorito = '';

  // Control de proveedor (google vs local)
  proveedor = 'local';
  readonly TOTAL_AVATARES = 17;

  avatares = Array.from(
    { length: this.TOTAL_AVATARES },
    (_, i) => `assets/avatars/avatar${i + 1}.png`
  );


  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef

  ) {
    addIcons({ personOutline, cameraOutline, checkmarkOutline, closeOutline });
  }

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (!userId) {
      return;
    }

    this.username = this.auth.getUsername();
    this.fotoSeleccionada = this.auth.getFotoPerfil();

    //cargamos datosdel backend
    this.http.get<any>(`http://localhost:8080/usuarios/${userId}/perfil`)
      .subscribe({
        next: (u) => {
          this.username = u.username;
          this.bio = u.bio || '';
          this.generoFavorito = u.generoFavorito || '';
          this.fotoSeleccionada = u.fotoPerfil || null;
          this.proveedor = u.proveedor || 'LOCAL';
        },
        error: () => { } //si falla, usamos los datos del localStorage
      });
  }

  seleccionarAvatar(ruta: string) {
    this.fotoSeleccionada = ruta;
  }


  async guardarCambios() {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.mostrarToast('Sesión no válida');
      return;
    }

    //nombre de usuario obligatorio
    // yusamos trim() para evitar que el usuario ponga solo espacios
    if (!this.username || this.username.trim().length === 0) {
      this.mostrarToast('El nombre de usuario no puede estar vacío');
      return; // Detiene la ejecución
    }

    //contraseña (solo si el proveedor es local y hay texto)
    if (this.proveedor === 'local' && this.password) {
      if (this.password !== this.confirmPassword) {
        this.mostrarToast('Las contraseñas no coinciden');
        return;
      }
    }

    //preparacion del body:
    const body = {
      username: this.username.trim(), // enviamos el nombre sin espacios 
      fotoPerfil: this.fotoSeleccionada,
      bio: this.bio ? this.bio.trim() : '',
      generoFavorito: this.generoFavorito,
      password: this.password || null
    };

    //peticin al backend:
    this.http.put(`http://localhost:8080/usuarios/${userId}`, body)
      .subscribe({
        next: () => {
          //actualizamos el storage local para que los cambios se vean en toda la app
          this.auth.saveUsername(body.username);
          this.auth.saveBio(body.bio);
          this.auth.saveGeneroFav(body.generoFavorito);

          if (this.fotoSeleccionada) {
            this.auth.saveFotoPerfil(this.fotoSeleccionada);
          }
          else {
            localStorage.removeItem('fotoPerfil');
          }

          // Redirigimos al perfil
          this.router.navigate(['/tabs/profile'], { replaceUrl: true });
        },

        error: (err) => {
          console.error('Error al actualizar:', err);
          this.mostrarToast('Error al conectar con el servidor');
        }
      });
  }


  async mostrarToast(msj: string) {
    const toast = await this.toastCtrl.create({ message: msj, duration: 2000 });
    toast.present();
  }


  async abrirSelectorAvatar() {
    const modal = await this.modalCtrl.create({
      component: AvatarSelectorComponent,
      cssClass: 'modal-alert-center',
      backdropDismiss: true,
      componentProps: {
        avatares: this.avatares,
        seleccionada: this.fotoSeleccionada
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.foto !== undefined) {
      this.fotoSeleccionada = data.foto;
      this.cdr.detectChanges();         //con estoforzamos a angular a mostrar la imagen ya
      console.log('Nueva foto lista para previsualizar:', data.foto);
    }

  }



}