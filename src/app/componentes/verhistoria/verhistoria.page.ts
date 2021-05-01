import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, LoadingController,IonSlides } from '@ionic/angular';
import { HistoriasService } from '../../servicios/historias.service';
import { environment } from '../../../environments/environment';
import { VerfotosPage } from '../verfotos/verfotos.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verhistoria',
  templateUrl: './verhistoria.page.html',
  styleUrls: ['./verhistoria.page.scss'],
})
export class VerhistoriaPage implements OnInit {
  historia: any;
  id: any;
  image;
  urlFiles: string;
  name: string;
  contenido: any;
  files: any;
   //Ion slides
   @ViewChild('slides') slides: IonSlides;
   //Configuracion fotos
   slideOpts = {
     initialSlide: 0,
     speed: 400
   };
  constructor(public modal: ModalController, private historias: HistoriasService,
              private loading: LoadingController, private route: ActivatedRoute) { 
    this.historia = [];
    this.urlFiles = environment.urlFiles;
    this.contenido = [];
    this.files = [];
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
  });
  }
  Cancelar(){
    this.modal.dismiss();
   }
  ngOnInit() {
    this.getHistory();
  }
  async getHistory(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
    });
    await loading.present();
    this.historias.getStory(this.id).then(
      (res: any) => {
        loading.dismiss();
        //let his = JSON.parse(res.data);

        this.historia = res.story;
        console.log(res);
        this.image = `${this.urlFiles}${this.historia.featured_image}`;
        (<HTMLInputElement>document.getElementById('desc')).innerHTML = this.historia.description;

        this.contenido = JSON.parse(this.historia.content);
        for(let archivo of this.contenido.files){
          let file = `${this.contenido.directoryUrl}${archivo}`
          this.files.push(file)
        }
        console.log(this.files)
        console.log(this.contenido)
        if(this.historia.user_profile){
          this.name = this.historia.user_profile.name;

        }
        //this.PorfileImage = `${environment.urlFiles}${this.user.picture}`;
        //console.log(this.PorfileImage);
       // this.TomarValores();
      },
      (error) =>{
        loading.dismiss();

        console.error(error);
      }
    );
  }
  async verFotos(foto){
    console.log('hola');
    const modal = await this.modal.create({
      component: VerfotosPage,
      componentProps: {
        foto
      }
  });
    return modal.present();

}

}
