import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-verfotos',
  templateUrl: './verfotos.page.html',
  styleUrls: ['./verfotos.page.scss'],
})
export class VerfotosPage implements OnInit {
  @Input()foto: any;
   //Ion slides
   @ViewChild('slides') slides: IonSlides;
   //Configuracion fotos
   slideOpts = {
     initialSlide: 0,
     speed: 400
   };
  constructor(public modal: ModalController) { }

  ngOnInit() {
    console.log(this.foto)
  }

}
