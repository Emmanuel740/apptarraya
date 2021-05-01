import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mostrar = false;
  @ViewChild('contenido, { read: ElementRef }') contenido: ElementRef;

  constructor(private router: Router, private storage: Storage) { }

  ngOnInit() {
    const video: HTMLElement = document.getElementById('video');
    video.hidden = true;
    video.addEventListener('play',(event:any) =>{
     this.show();
    });
    video.addEventListener('ended',(event:any) =>{
      this.redirect();
    })
    // const txt: HTMLElement = document.getElementById('contenido');
    // txt.addEventListener('click',(event:any) =>{
    //  txt.hidden = true;
    //  })
    
   
  }
  async show(){
    const video: HTMLElement = document.getElementById('video');
    //(<HTMLInputElement>document.getElementById('contenido')).innerHTML = '<p style="font-weight: bold; color: #004F5E;">Presiona para continuar</p>';
    video.hidden = false;
    
  }

  redirect(){

      this.storage.get('login').then((val: any) => {
        //alert(val)
        if(val === null){
          this.router.navigate(['/login']);

        }else{
          console.log('', val);
          if(val.islogedin){
            environment.accessToken = val.token;
            console.log(environment.accessToken)
            this.router.navigate(['/home']);
    
          }else{
            this.router.navigate(['/login']);
  
          }
        }
        
      });
  }

}
