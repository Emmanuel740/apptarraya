import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/servicios/login.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('passwordEyeRegister, { read: ElementRef }') passwordEye: ElementRef;

  // Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput  =  'password';
  usuario = '';
  password = '';
  user:any;
  
  constructor(private login: LoginService,
    private router: Router, private alerta: AlertController,
    private storage: Storage, private loading: LoadingController, private browser: InAppBrowser
    ) {
      this.user= [];
     }
    openResetPassword(){
      const browser = this.browser.create('https://lapiragua.com.co/password/reset');
    }
    async logear(){
      const loading = await this.loading.create();
      await loading.present();  
     
      this.login.Logear(this.usuario,this.password).then(
        data => {
          console.log(data);
           this.user = data;
           environment.accessToken = this.user.access_token;
           environment.refreshToken = this.user.refresh_token;
           //environment.password = this.password;
           this.storage.set('login',{
             islogedin: true,
             token: this.user.access_token
           });
           const navigationExtras: NavigationExtras = {
            state: {
              update: false
            }
          };
          loading.dismiss();
          this.router.navigate(['/home'],navigationExtras);

        },
        (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: 'Usuario y/o contraseña incorrectos',
            //text: err.message,
            showConfirmButton: true         
          });
          loading.dismiss();


        }


      );
    
  
  }
  validarCampos(){
    if(this.usuario === '' || this.password === ''){
        console.log('usuario y contraseña son obligatorios')
        this.presentAlert();
    }else{
        this.logear();
    }
  }
  async presentAlert() {
    const alert = await this.alerta.create({
      cssClass: 'my-custom-class',
      header: 'Usuario y contraseña son requeridos',
      buttons: ['ACEPTAR']
    });

    await alert.present();
  }
  loginGoogle(){
    this.login.LoginGoogle();
  }
  loginWithFB(){
    this.login.LoginFacebook();
  }
  togglePasswordMode() {
  //cambiar tipo input
  this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
   //obtener el input
  const nativeEl = this.passwordEye.nativeElement.querySelector('input');
   //obtener el indice de la posición del texto actual en el input
  const inputSelection = nativeEl.selectionStart;
   //ejecuto el focus al input
  nativeEl.focus();
  //espero un milisegundo y actualizo la posición del indice del texto
  setTimeout(() => {
       nativeEl.setSelectionRange(inputSelection, inputSelection);
   }, 1);
  
  }
  
  

  redirectOffline(){
    this.router.navigate(['/modooffline']);

  }
  redirectCrearCuenta(){
    this.router.navigate(['/registrarse']);

  }
  redirectRecuperar(){
    this.login.redirectRecuperar();

  }
  ngOnInit() {
    //this.checarCredenciales();
  }
  checarCredenciales(){
    this.storage.get('login').then((val: any) => {
      
      console.log('', val);
      if(val.islogedin){
        environment.accessToken = val.token;
        console.log(environment.accessToken)
        this.router.navigate(['home']);

      }
    });
  
  }

}
