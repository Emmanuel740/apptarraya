import { Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../servicios/historias.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { VerhistoriaPage } from '../verhistoria/verhistoria.page';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-listahistorias',
  templateUrl: './listahistorias.page.html',
  styleUrls: ['./listahistorias.page.scss'],
})
export class ListahistoriasPage implements OnInit {
  listaHistorias: any;
  busqueda;
  url: any;
  constructor(private historias: HistoriasService, 
              private loading: LoadingController,
              private modal: ModalController, private router: Router) {
                this.url = environment.urlApi;
               }

  ngOnInit() {
   this.getStoryList();
  }
  async getStoryList(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
    });
    await loading.present();

     this.historias.getStoriesList().then(
       (res: any) => {
         loading.dismiss();
         ///this.listaHistorias = JSON.parse(res.data);
         this.listaHistorias = res;
         console.log(res);
       },
       (error) =>{
        loading.dismiss();

         console.error(error);
       }
     );
   }
  // async getStoryList() {
  //   alert('token '+environment.accessToken)

  //   let nativeCall = this.http.get(`${this.url}api/stories-list`,{},{
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${environment.accessToken}`,
   
  //   })
  //   from(nativeCall).pipe(
  //   )
  //   .subscribe(data =>{
     
  //     this.listaHistorias =  JSON.parse(data.data);
  //     alert(this.listaHistorias)
  //     },err =>{
  //     alert(err);
  //   });

    
  // }
   async verHistoria(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          id
      }
  };
  
    this.router.navigate(['verhistoria'], navigationExtras)
  

}

}
