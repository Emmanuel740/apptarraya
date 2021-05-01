import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras} from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { RegistrarService } from './registrar.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoginpassPage } from '../componentes/loginpass/loginpass.page';
const OAUTH_CLIENT_ID = '2';
const OAUTH_CLIENT_SECRET = 'Iok7COuJrrwZfw460UyatFe9gHaeYyCbHVs1MqIC';
const WebClientId = '114677626104-0t06dpfrrvflkqqc27top06ausg51il3.apps.googleusercontent.com';
@Injectable({
  providedIn: 'root'
})

export class LoginService {
  usuario: any;
  url: string;
  
  constructor(private httpClient: HttpClient, private google:GooglePlus ,
              private registrar: RegistrarService,
              private router: Router, private storage: Storage, 
              private facebook: Facebook, private loading: LoadingController,
              private modal: ModalController
              /*private network: NetworkService*/) { 
    this.url = environment.urlApi;
    this.usuario = [];
  }
 async Logear(username, password) {
  
  //console.log(this.network.getCurrentNetworkStatus());
  let refreshData = new FormData();
  refreshData.append('grant_type', 'password');
  refreshData.append('client_id', OAUTH_CLIENT_ID);
  refreshData.append('client_secret', OAUTH_CLIENT_SECRET);
  refreshData.append('username', username);
  refreshData.append('password', password);
  refreshData.append('scope', '*');


    
    console.log(username);
    console.log(password);
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'POST, GET, OPTIONS, PUT',
      'Accept':'application/json',
      'content-type':'application/json'
     
    });
    console.log(headers)
    return this.httpClient.post(`${this.url}oauth/token`, refreshData).toPromise();
    
}
async LoginGoogle() {
  const loading =  await this.loading.create({
    message: 'Conectando...',
  });
  loading.present();
 return this.google.login({}).then((res)=>{
  // const r = JSON.stringify(res);
  // alert('exito: '+r)
   let usr = {
    email: res.email, 
    name: res.givenName+' '+res.familyName, 
    username: res.displayName,
    password: res.userId,
    password_confirmation: res.userId,
    }
    loading.dismiss();
    this.ChecarRegistro(usr,'Google');

 },(err)=>{
  loading.dismiss();
   alert('Fallo el login con Google')

 });
 
  
}
async LoginFacebook(){
 const loading =  await this.loading.create({
    message: 'Conectando...',
  });
  loading.present();
    return this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        
        let usr = {
          email: profile['email'], 
          name: profile['name'], 
          username: profile['first_name']+profile['last_name'],
          password: profile['id'],
          password_confirmation:profile['id']
          }
        loading.dismiss();
        this.ChecarRegistro(usr, 'Facebook');

      });
    },(err)=>{
      loading.dismiss();
      alert('Fallo el login con Facebook')

    });
  
}
async ChecarRegistro(user,mensaje){
  
  this.Logear(user.email,user.password).then(
    data => {
      console.log(data);
       this.usuario = data;
       environment.accessToken = this.usuario.access_token;
       environment.refreshToken = this.usuario.refresh_token;
      // environment.password = user.password;
       this.storage.set('login',{
         islogedin: true,
         token: this.usuario.access_token
       });
       const navigationExtras: NavigationExtras = {
        state: {
          update: false
        }
      };
      this.router.navigate(['/home'],navigationExtras);

    },
    (err) => {
      console.log(err);
      this.Registrar(user,mensaje);

    }


  );
}
Registrar(user,msg){
  
  this.registrar.RegistarUsuario(user).then(
    (res: any) => {
      //let r = JSON.stringify(res);
      //alert(r);
      if(res.result === "error"){
        //this.errores = respuesta.errors.toString();
        if(res.errors.email){
          //alert(res.errors.email);
          this.LoginPass(user);
        }
        
      }else{
      this.ChecarRegistro(user,msg);
      }
    },(err)=>{
      alert('Error al registrar con '+msg);

    });
}
async LoginPass(user){
  console.log('hola');
  const modal = await this.modal.create({
    component: LoginpassPage,
    componentProps: {
      user
    }
});
  return modal.present();

}
redirect(){
  this.router.navigate(['/registrarse']);

}
redirectRecuperar(){
  this.router.navigate(['recuperar']);

}
}
