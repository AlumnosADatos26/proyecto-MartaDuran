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
  readonly TOTAL_AVATARES = 9;

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
    if (!userId) return;

    //validación de contraseña solo si es local y escribió algo
    if (this.proveedor === 'local' && this.password) {
      if (this.password !== this.confirmPassword) {
        this.mostrarToast('Las contraseñas no coinciden');
        return;
      }
    }

    //el objeto que espera UsuarioController
    const body = {
      username: this.username,
      fotoPerfil: this.fotoSeleccionada,
      bio: this.bio,
      generoFavorito: this.generoFavorito,
      password: this.password || null //si está vacío java lo ignorará
    };

    this.http.put(`http://localhost:8080/usuarios/${userId}`, body)
      .subscribe({
        next: () => {
          this.auth.saveUsername(this.username);
          this.auth.saveBio(this.bio);
          this.auth.saveGeneroFav(this.generoFavorito);

          if (this.fotoSeleccionada) {
            this.auth.saveFotoPerfil(this.fotoSeleccionada);
          }
          else {
            localStorage.removeItem('fotoPerfil');
          }

          this.router.navigate(['/tabs/profile'], { replaceUrl: true });
        },

        error: (err) => {
          console.error(err);
          this.mostrarToast('Error al guardar los cambios');
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