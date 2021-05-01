import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private storage: Storage, private router: Router) {
    // this.platform.ready().then((readySource) => {
    //   console.log('ready');
    //   return this.storage.get('login').then(valor => {
    //     console.log(valor)
    //     if(valor.islogedin){
    //     this.router.navigate(['home']);
    //     }
    //     // Save old & new local transactions back to Storage
    //   });
    // });

  }
}
