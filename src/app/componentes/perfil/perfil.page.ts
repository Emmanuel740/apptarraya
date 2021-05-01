import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { environment } from 'src/environments/environment';
import { EditarusuarioPage } from '../editarusuario/editarusuario.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user: any;
  ProfileImage: string;
  description: string;
  constructor(private servicioUser: UsuarioService, 
              private modal: ModalController, 
              private loading: LoadingController, private router: Router, private webView: WebView) { 
    this.user = [];
  }

  ngOnInit() {
    this.getUser();
  }
  async getUser(){
    this.ProfileImage = '';
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
    });
    await loading.present();

    this.servicioUser.getUser().then(
      (res: any) => {
        loading.dismiss();
        this.user = res;
        console.log(this.user);
        environment.user = this.user;
        this.ProfileImage = `${environment.urlFiles}${this.user.profile.picture}`;
        this.description = this.user.profile.description;
        console.log(this.ProfileImage);
       // this.TomarValores();
      },
      (error) =>{
        loading.dismiss();

        console.error(error);
      }
    );
  }
  async rediredtEditar(){
    
      console.log('hola');
      const modal = await this.modal.create({
        component: EditarusuarioPage,
        componentProps: {
          user: this.user
        }
        
    });
    modal.onDidDismiss().then((res)=>{
       this.getUser();
       
       //this.router.navigate(['/home'])
    });
      return modal.present();
  
  
  }
  

}
