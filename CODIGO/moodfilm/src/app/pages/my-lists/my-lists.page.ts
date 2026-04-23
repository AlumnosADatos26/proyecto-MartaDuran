import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ListaService } from 'src/app/services/ListaService';
import { AuthService } from 'src/app/services/authService';
import { addIcons } from 'ionicons';
import { add, arrowForward, trashOutline, folderOutline, chevronForwardCircle, createOutline } from 'ionicons/icons';


@Component({
  selector: 'app-my-lists',
  templateUrl: './my-lists.page.html',
  styleUrls: ['./my-lists.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MyListsPage implements OnInit {
  listasPersonales: any[] = [];

  constructor(
    private listaService: ListaService,
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({ add, arrowForward, trashOutline, folderOutline, chevronForwardCircle, createOutline });
  }


  ngOnInit() {
    this.cargarListas();
  }

  async cargarListas() {
    const userId = this.auth.getUserId();
    if (!userId) return;

    try {
      const todasLasListas: any[] = await this.listaService.getListas(userId);

      const filtradas = todasLasListas.filter((l: any) =>
        l.nombre !== 'Favoritas' &&
        l.nombre !== 'Vistas' &&
        l.nombre !== 'Por ver'
      );

      this.listasPersonales = await Promise.all(filtradas.map(async (lista: any) => {
        const pelis = await this.listaService.getPeliculasDeLista(lista.id);
        return {
          ...lista,
          contador: pelis.length
        };
      }));
    }
    catch (e) {
      console.error("Error cargando listas", e);
    }
  }

  verLista(lista: any) {
    this.router.navigate(['/list-movies'], {
      queryParams: { listaId: lista.id, nombre: lista.nombre }
    });
  }

  async nuevaLista() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Lista',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de tu lista...',
          attributes: {
            maxlength: 25 
          }
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: async (data) => {
            const userId = this.auth.getUserId();
            if (data.nombre && data.nombre.trim().length > 0 && userId) {
              // REINSERTAMOS LA LÓGICA DE GUARDADO:
              await this.listaService.crearLista(userId, data.nombre);
              this.cargarListas(); // Refresca la pantalla para que aparezca la nueva
            }
          }
        }
      ],
      cssClass: 'alert-moderno'
    });
    await alert.present();
  }


  async eliminarLista(lista: any) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar lista?',
      message: `¿Estás seguro de que quieres borrar "${lista.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.listaService.eliminarLista(lista.id);
              // refrescamos la interfaz tras borrar:
              this.listasPersonales = this.listasPersonales.filter(l => l.id !== lista.id);
            } catch (e) {
              console.error("Error al borrar", e);
            }
          }
        }
      ],
      cssClass: 'alert-moderno'
    });

    await alert.present();
  }


  async editarLista(lista: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar nombre',
      inputs: [
        {
          name: 'nuevoNombre',
          type: 'text',
          value: lista.nombre, 
          placeholder: 'Nombre de la lista',
          attributes: {
            maxlength: 25
          }
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.nuevoNombre && data.nuevoNombre.trim().length > 0) {
              try {
                await this.listaService.editarLista(lista.id, data.nuevoNombre);
                this.cargarListas(); //refrescamos
              } catch (e) {
                console.error("Error al editar", e);
              }
            }
          }
        }
      ],
      cssClass: 'alert-moderno'
    });
    await alert.present();
  }

}