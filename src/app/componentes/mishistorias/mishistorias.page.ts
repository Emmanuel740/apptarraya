import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
//import { HistoriasService } from '../../servicios/historias.service';
import { VerhistoriaPage } from '../verhistoria/verhistoria.page';
import { HistoriasService } from '../../servicios/historias.service';
import { IonSlides } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-mishistorias',
  templateUrl: './mishistorias.page.html',
  styleUrls: ['./mishistorias.page.scss'],
})
export class MishistoriasPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  Mishistorias: any;
  fotos: any;
  lon = 0;
  constructor(private modal: ModalController, 
    private historias: HistoriasService, 
    private loading: LoadingController, private router: Router) { 
    this.Mishistorias = [];
    this.fotos = [];
  }
  

  ngOnInit() {
    this.getMisHistorias();
  }
  async borrarHistoria(id){
    const loading = await this.loading.create();
    loading.present();
    this.historias.deleteStory(id).
    then((res: any)=>{
      loading.dismiss();
       console.log(res);
       this.getMisHistorias();
    },(err)=>{
      loading.dismiss();
       console.log(err);
    })
  }
  AlertBorrar(id){
    Swal.fire({
      title: 'Aención',
      text: '¿Estas seguro de borrar esta historia?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc409',
      cancelButtonColor: '#004F5E',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.value) {
      this.borrarHistoria(id);
      }
    });

  }
  async getMisHistorias(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
    });
    await loading.present();

    this.historias.getMyStories().then(
      (res: any) => {
        loading.dismiss();
        //this.Mishistorias = JSON.parse(res.data);
        this.Mishistorias = res.reverse();
        this.lon = this.Mishistorias.length;
        for(let historia of this.Mishistorias){
          let image = `${environment.urlFiles}${historia.featured_image}`
          this.fotos.push(image);
        }
        console.log(res);
      },
      (error) =>{
        loading.dismiss();

        console.error(error);
      }
    );
  }
  async verHistoria(id){
  //   console.log('hola');
  //   const modal = await this.modal.create({
  //     component: VerhistoriaPage,
  //     componentProps: {
  //       id
  //     }
  // });
  //   return modal.present();
  let navigationExtras: NavigationExtras = {
    queryParams: {
        id
    }
};

  this.router.navigate(['verhistoria'], navigationExtras)

}

}
