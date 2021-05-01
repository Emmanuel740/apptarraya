import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SubirhistoriaPage } from '../subirhistoria/subirhistoria.page';

const STORAGE_REQ_KEY = 'historias_storage';

@Component({
  selector: 'app-pescarhistorias',
  templateUrl: './pescarhistorias.page.html',
  styleUrls: ['./pescarhistorias.page.scss'],
})
export class PescarhistoriasPage implements OnInit {
  historiasLocales: any;
  @ViewChild('slides') slides: IonSlides;
  //Configuracion fotos
  fotos: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor(private storage: Storage, private modal: ModalController) { 
    this.historiasLocales = [];
  }

  ngOnInit() {
    this.getLocalStories();
  }
  getLocalStories(){
    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      this.historiasLocales = JSON.parse(storedOperations);
      console.log(this.historiasLocales);
      // Save old & new local transactions back to Storage
    });
  }
  verhistoria(i){
  }
  async verHistoria(i){
    console.log(this.historiasLocales[i])
    
    const modal = await this.modal.create({
      component: SubirhistoriaPage,
      componentProps: {
        posicion: i,
        story: this.historiasLocales[i].data
      }
  });
    return modal.present();

}

}
