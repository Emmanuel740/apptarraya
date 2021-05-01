import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  user: any;
  PorfileImage: string;
  name: string;
  url: string;
  imagen= '';
  constructor(private menu: MenuController, private router: Router,
              private servicioUser: UsuarioService,
              private storage: Storage, private loading: LoadingController,
              public navCtrl: NavController) {
    this.user = [];
    this.url = environment.urlApi;
  //   const navigation = this.router.getCurrentNavigation();
  //   const state = navigation.extras.state as {
  //   update: boolean,
  // };
  // //alert('este es el estado'+state.update)
  // if(state.update){
  //   this.getUser();
  //   //alert('entro true')
  // }
    

  }
  openFirst() {
    //this.menu.enable(true, 'first');
    this.menu.open();
  }
  cerrar(){
    this.menu.close();
  }
  perfil(){
    this.menu.close();
    this.router.navigate(['/perfil']);
    
  }
  ngOnInit(){
     this.getUser();
   }
    async getUser(){
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
      });
      await loading.present();
  
     this.servicioUser.getUser().then(
       (res: any) => {
         console.log(res);
         this.user = res;
         console.log(this.user);
         environment.user = this.user.profile;
         this.imagen = this.user.profile.picture;
         this.PorfileImage = `${environment.urlFiles}${this.user.profile.picture}`;
         //alert(this.PorfileImage)
         console.log(this.PorfileImage);
         this.name = this.user.profile.name;
         loading.dismiss();
        // this.TomarValores();
       },
       (error) =>{
         console.error(error);
         loading.dismiss();

       }
     );
   }
  // async getUser() {

  //   let nativeCall = this.http.get(`${this.url}api/user`,{},{
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${environment.accessToken}`,
   
  //   })
  //   from(nativeCall).pipe(
  //   )
  //   .subscribe(data =>{
     
  //     this.user =  JSON.parse(data.data);
  //     environment.user = this.user.profile;
  //     this.imagen = this.user.profile.picture;
  //     this.PorfileImage = `${environment.urlFiles}${this.user.profile.picture}`;
  //     this.name = this.user.profile.name;

  //   },err =>{
  //   });

 
  // }
   explorar(){
     this.router.navigate(['/explorar']);
   }
   cerrarSesion(){
    console.log('sesion Cerrada');
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Estas apunto de cerrar tu sesión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc409',
      cancelButtonColor: '#004F5E',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cerrar'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/login']);
        this.storage.set('login',{
          islogedin: false,
          token: ''
        } );
        //this.storage.set('actualPass', '');
        environment.accessToken= '';
        environment.refreshToken='';
        environment.user= [];

        Swal.fire({
          title: 'Nos Vemos pronto!',
          timer: 1500,
          showConfirmButton: false
        }
        );
      }
    });
  }
}
