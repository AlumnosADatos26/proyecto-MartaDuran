
import { Component, OnInit } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService';
import { ComentarioService } from 'src/app/services/ComentarioService';
import { addIcons } from 'ionicons';
import { arrowBackOutline, globeOutline, lockClosedOutline, personCircleOutline, chatbubblesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.page.html',
  styleUrls: ['./my-comments.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MyCommentsPage implements OnInit {

  comentarios: any[] = [];

  constructor(
    private auth: AuthService,
    private comentarioService: ComentarioService,
    private router: Router,
    private navCtrl: NavController
  ) {
    addIcons({ arrowBackOutline, globeOutline, lockClosedOutline, personCircleOutline, chatbubblesOutline });
  }

  async ngOnInit() { }

  async ionViewWillEnter() {
    const userId = this.auth.getUserId();
    if (userId) {
      this.comentarios = await this.comentarioService.getComentariosPorUsuario(userId);
    }
  }

  irAPelicula(tmdbId: number) {
    this.router.navigate(['/movie-details'], { queryParams: { id: tmdbId } });
  }

  goBack() {
    this.navCtrl.back();
  }

}