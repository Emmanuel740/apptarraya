import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RegistrarService } from '../../servicios/registrar.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {
  @ViewChild('passwordEyeRegister, { read: ElementRef }') passwordEye: ElementRef;

// Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput  =  'password';
  name: string;
  username: string;
  email: string;
  password: string;
  confirmacionpassword;
  errores: any;
  constructor(private registrar: RegistrarService, 
              private loading: LoadingController,
              private router: Router) { 
              }

  ngOnInit() {
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
 async RegistrarUsuario(){
   let user ={
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      password_confirmation: this.confirmacionpassword
   }
   const loading = await this.loading.create();
  await loading.present();
   this.registrar.RegistarUsuario(user).then(
    (res: any) => {
      loading.dismiss();
      //this.errores = res.data;
     // let r = JSON.stringify(res);
     // alert(r);
      let respuesta = res;
                if(respuesta.result === "error"){
                  //this.errores = respuesta.errors.toString();
                  if(respuesta.errors.name){
                    this.ErrorAlert(respuesta.errors.name);
                  }
                  if(respuesta.errors.username){
                    this.ErrorAlert(respuesta.errors.username);
                  }
                  if(respuesta.errors.email){
                    this.ErrorAlert(respuesta.errors.email);
                  }
                  if(respuesta.errors.name){
                    this.ErrorAlert(respuesta.errors.password);
                  }
                }else{
                  this.errores = respuesta;
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Listo',
                    text: user.name+' ha sido registrado con exito',
                    showConfirmButton: true         
                  });
                  this.router.navigate(['/login']);
                }
    },
    (error) =>{
      loading.dismiss();
     // alert(error);
      this.errores = error;
      console.error(error);
    }
  );
 }
 ErrorAlert(mensaje){
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Error',
    text: mensaje,
    showConfirmButton: true         
  });
 }

}
