import { Component, OnInit, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { environment } from '../../../environments/environment';
import { LoadingController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../servicios/usuario.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-editarusuario',
  templateUrl: './editarusuario.page.html',
  styleUrls: ['./editarusuario.page.scss'],
})
export class EditarusuarioPage implements OnInit {
  base64Image: string;
  @Input()user: any;
  name: string;
  username: string;
  email: string;
  descripcion: string;
  img = '';
  constructor(private camera: Camera, private modal: ModalController, 
              private usuario: UsuarioService, private webview: WebView,
              private loading : LoadingController, private router: Router) { }
  
  ngOnInit() {
    console.log(this.user);
    this.MostrarUsuario();
  }
  close(){
this.modal.dismiss();
  }
  MostrarUsuario(){
    this.img = `${environment.urlFiles}${this.user.profile.picture}`;
    this.name = this.user.profile.name;
    this.username = this.user.username;
    this.email = this.user.email;
    this.descripcion = this.user.profile.description;
  }
  
  async quitarImagen(){
    this.base64Image = '';
    (<HTMLInputElement>document.getElementById('img')).src = '../assets/imagenes/default_image.png';
  
  }
  async fotoGaleria(){
    const optionsGallery: CameraOptions = {
      
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE }
  
    this.camera.getPicture(optionsGallery).then((imageData) => {
       this.base64Image = imageData;
       this.img = this.webview.convertFileSrc(imageData);

      // (<HTMLInputElement>document.getElementById('img')).src = this.base64Image;
  
     }, (err) => {
      // Handle error
      console.log(err)
     });
  }
  
  async hacerFoto() {
    
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    const result = await this.camera.getPicture(options).then((imageData) => {
      this.base64Image = imageData;
      this.img = this.webview.convertFileSrc(imageData);
     // (<HTMLInputElement>document.getElementById('img')).src = this.base64Image;
  
    }, (err) => {
      console.log(err);
    });
    
  }
  async editar(){
    let user = {
      name: this.name,
      username: this.username,
      email: this.email,
      description: this.descripcion,
      picture: this.base64Image
    }
    const loading = this.loading.create();
    (await loading).present();

    this.usuario.editUser(user).then(
      (res: any) => {
        //let r = JSON.stringify(res)
        //alert(r);
        console.log(res);
        //let respuesta = JSON.parse(res.data)
        let respuesta = res;
       // alert('respuesta historia '+respuesta);
        //this.postContent(story,respuesta.storyId);
        this.loading.dismiss();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Listo!',
          text: 'Usuario editado',
          showConfirmButton: true         
        });
        const navigationExtras: NavigationExtras = {
          state: {
            update: true
          }
        };
        this.router.navigate(['/home'],navigationExtras);
        this.modal.dismiss();
        
    
      },
      (error) =>{
        console.error(error);
       // alert('error historia '+error);
       Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error!',
        text: 'No se ha podido editar el usuario',
        showConfirmButton: true         
      });
       this.loading.dismiss();


       alert(error)
      }
    );
  }

}
