import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})

export class AppComponent {
  constructor() {
    this.hideSplash();
  }

  hideSplash() {
    setTimeout(() => {
      const splash = document.getElementById('manual-splash');
      if (splash) {
        splash.classList.add('fade-out');
        //lo borramos del todo después de la animacion para que no consuma recursos
        setTimeout(() => splash.remove(), 500);
      }
    }, 4000);
  }
}