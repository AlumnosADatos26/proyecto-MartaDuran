import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})

export class AvatarSelectorComponent {
  @Input() avatares: string[] = [];
  @Input() seleccionada: string | null = null;

  constructor(private modalCtrl: ModalController) {
    addIcons({ personOutline });
  }

  elegir(foto: string | null) {
    this.modalCtrl.dismiss({
      'foto': foto
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  
}