import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../servicios/login.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-loginpass',
  templateUrl: './loginpass.page.html',
  styleUrls: ['./loginpass.page.scss'],
})
export class LoginpassPage implements OnInit {
  @Input()user: any;
  @ViewChild('passwordEyeRegister, { read: ElementRef }') passwordEye: ElementRef;
  password: string;
  // Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput  =  'password';
  constructor(private modal: ModalController, private log: LoginService, 
              private storage: Storage, private router: Router, private loading: LoadingController) { }

  ngOnInit() {
  }
  close(){
    this.modal.dismiss();
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
    async login(){
      const loading = await this.loading.create();
      await loading.present(); 
        this.log.Logear(this.user.email,this.password).then(
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
            this.modal.dismiss();
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

}
