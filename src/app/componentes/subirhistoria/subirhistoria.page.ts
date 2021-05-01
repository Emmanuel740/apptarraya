import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { IonSlides, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { HistoriasService } from '../../servicios/historias.service';
import { NetworkService } from '../../servicios/network.service';
import Swal from 'sweetalert2';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { VerfotosPage } from '../verfotos/verfotos.page';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/File/ngx';
import { CaptureVideoOptions, MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';

const STORAGE_REQ_KEY = 'historias_storage';
declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}
@Component({
  selector: 'app-subirhistoria',
  templateUrl: './subirhistoria.page.html',
  styleUrls: ['./subirhistoria.page.scss'],
})
export class SubirhistoriaPage implements OnInit {
  @Input()posicion: any;
  @Input()story: any;


  @ViewChild('slides') slides: IonSlides;
  //Configuracion fotos
  fotos: any;
  fotosMostrar: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  //Google maps
  //map = null;
  markers: Marker[];
  @ViewChild('map') divMap: ElementRef;
  label = {
    titulo: 'Ubicacion',
    subtitulo: 'Mi ubicacion'
  }

  map: any;
  marker:any;
  infowindow: any;
  positionSet: any;
  
  // Parametros guardar historia
  nombre = '';
  lat: any;
  lon: any;
  ciudad = '';
  descripcion = '';
  date = new Date();
  year = '';
  id ='';
  // Imagen de historia 
  base64Image = '';
  img = '';
  video: any;
  audio: MediaObject;
  estatusAudio = '';
  srcAudio = '';
  constructor(private camera: Camera, private router: Router, 
    private historias: HistoriasService,
    private network: NetworkService, public modal: ModalController, 
    private webview: WebView, private media: Media, 
    private toastController: ToastController, 
    private actionSheetController: ActionSheetController, private mediaCapture: MediaCapture,
    private file: File) {
    this.fotos = [];
    this.fotosMostrar = [];
    this.year = this.date.getFullYear().toString();
   }
   //////////////////// Mapa
   ngOnInit() {
    this.mostrarDatos();
      }
      mostrarDatos(){
        this.nombre = this.story.name;
        this.lat = this.story.location.latitude;
        this.lon = this.story.location.longitude;
        this.ciudad = this.story.location_name;
        this.year = this.story.year;
        this.id = this.story.id;
        this.descripcion = this.story.description;
        this.base64Image = this.story.featured_image;
        this.img = this.webview.convertFileSrc(this.story.featured_image);

        this.fotos = this.story.elements;
        //this.fotosMostrar = this.story.fotosMostrar;
        if(this.story.fotosMostrar){
          for( let foto of this.story.fotosMostrar){
            let f = this.webview.convertFileSrc(foto);
            this.fotosMostrar.push(f);
          }
        }
        
        this.loadMap();
  
      }
      async verFotos(foto){
        console.log('hola');
        const modal = await this.modal.create({
          component: VerfotosPage,
          componentProps: {
            foto
          }
      });
        return modal.present();
    
    }
      async loadMap() {
        // create a new map by passing HTMLElement
        const mapEle: HTMLElement = document.getElementById('map');
        // create LatLng object
        // const myLatLng = await this.geolocation.getCurrentPosition();
        // let lat = myLatLng.coords.latitude;
        // let lng = myLatLng.coords.longitude;
        // this.lat = lat;
        // this.lon = lng;


        // create map
        this.map = new google.maps.Map(mapEle, {
          center: {lat: this.lat, lng: this.lon},
          zoom: 12,
          disableDafaultUI: true,
          clickabelIcons: false
        });

      
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.getLocation();
          mapEle.classList.add('show-map');
        });
        
      }
      addMarker(marker: Marker) {
        let img = {
          url: '../assets/imagenes/marcador-mapa.png',
          scaledSize: new google.maps.Size(50, 50), // scaled size
        }
        const mar = new google.maps.Marker({
          position: marker.position,
          map: this.map,
          title: marker.title,
          draggable: true,
          icon: img
        });
        google.maps.event.addListener(mar,'drag', (event:any) =>{
           console.log(event.latLng.lat());
           console.log(event.latLng.lng());
          this.lat = event.latLng.lat();
          this.lon = event.latLng.lng();
        });
        
      }
      renderMarkers() {
        console.log(this.markers)
        this.markers.forEach(marker => {
          this.addMarker(marker);
        });
      }
      private async getLocation() {
        this.markers = [{
          position: {
            lat: this.lat,
            lng: this.lon,
          },
          title: 'Ubicacion de la historia'
          
        }];
        console.log(this.markers)
          this.renderMarkers();
        
      }
 

      //////////////////////////////////////////////////////

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

  async quitarImagen(){
    this.base64Image = '';
    (<HTMLInputElement>document.getElementById('img')).src = '../assets/imagenes/logo_full.png';
  
  }
  async hacerFotos() {
    let img = '';
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    const result = await this.camera.getPicture(options).then((imageData) => {
      img = imageData;
      let image = {
        tipo: 'imagen',
        src: this.webview.convertFileSrc(imageData)
      }
      this.fotosMostrar.push(image)
      this.fotos.push(img);
    }, (err) => {
      console.log(err);
    });
    
  }
  async fotosGaleria(){
    let img = '';
    const optionsGallery: CameraOptions = {
      
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.ALLMEDIA }
  
    this.camera.getPicture(optionsGallery).then((imageData) => {
      //alert(imageData)
      let extension = (imageData.substr(imageData.lastIndexOf('.') + 1)).toLowerCase()
      let image={};
      if(extension === 'jpg' || extension === 'jpeg' || extension === 'png'){
        image = {
          tipo: 'imagen',
          src: this.webview.convertFileSrc(imageData)
        }
      }else{
        image = {
          tipo: 'video',
          src: this.webview.convertFileSrc(imageData)
        }
      }
       
      img = imageData;
      this.fotosMostrar.push(image)
      this.fotos.push(img);
     }, (err) => {
      // Handle error
      console.log(err)
     });
  }
 

  guardarHistoria(){


    let date = new Date();
    this.id = `${date.getDay}${date.getMonth}${date.getSeconds}` 
    let story = {
      name: this.nombre,
      year: this.year,
      location: {
        latitude: this.lat,
        longitude: this.lon
      },
      featured_image: this.base64Image,
      location_name: this.ciudad,
      description: this.descripcion,
      elements: this.fotos,
      id: Date.now().toString(),
      dbid: this.id
  };

  
  this.historias.posHistory(story,true,this.posicion).then(
    (res: any) => {
      console.log(res);
      //let respuesta = JSON.parse(res.data)
      let respuesta = res;
     // alert('respuesta historia '+respuesta);
     this.modal.dismiss();
      this.router.navigate(['/home'])
    },
    (error) =>{
      console.error(error);
     // alert('error historia '+error);
    }
  );
  }

  

  checarInternet(){
    if(this.network.getCurrentNetworkStatus() === 1){
      this.alertaRed();
    }else{
      this.guardarHistoria();
    }

  }
  alertaRed(){

    Swal.fire({
      position: 'center',
      title: 'Sin Conexión',
      text: 'Conectate a internet para poder subir la historia',
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Aceptar'
    });
  }
  //////////////////////////////////////////////////////
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Elige una opción',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Foto',
        icon: 'camera',
        handler: () => {
          console.log('Share clicked');
          this.hacerFotos();
        }
      }, {
        text: 'Video',
        icon: 'camera',
        handler: () => {
          console.log('Favorite clicked');
          this.captureVideo();
        }
      }, {
        text: 'Galeria',
        icon: 'image',
        handler: () => {
          console.log('Favorite clicked');
          this.fotosGaleria();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async toastAudio(mensaje){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position:'top'
    });
    toast.present();
  }
  captureAudio() {
    this.audio =  this.media.create(this.file.externalRootDirectory + 'audio.mp3');
    this.srcAudio = this.file.externalRootDirectory + 'audio.mp3';
    this.audio.startRecord();
    this.estatusAudio = 'grabando';
    this.toastAudio('Grabando audio, para detener la grabación pulsa nuevamente el botón');
    // let options: CaptureAudioOptions ={
    //   limit: 1,
    //   duration: 120
    // }
    // this.mediaCapture.captureAudio(options).then((res: MediaFile[]) => {
    //   //alert(res);
    //   //this.storeMediaFiles(res);
    //   this.audio =  res[0].fullPath; 
    //   let aud = {
    //     tipo: 'audio',
    //     src: this.webview.convertFileSrc(res[0].fullPath)
    //   }
    //   this.fotosMostrar.push(aud)
    //   this.fotos.push(this.audio);
    //   //alert(this.audio);
    // }, (err: CaptureError) => console.error(err));

  }

  stopAudio(){
    this.audio.stopRecord();
    this.estatusAudio = '';
    let audio = {
      tipo: 'audio',
      src: this.webview.convertFileSrc(this.srcAudio)
      //audio: this.audio
    }
    this.fotosMostrar.push(audio);
    this.fotos.push(this.srcAudio);
    //this.audio.play();
    this.toastAudio('Audio guardado con éxito');


  }
  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 180
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
       this.video = res[0].fullPath;
       let vid = {
        tipo: 'video',
        src: this.webview.convertFileSrc(res[0].fullPath)
      }
       this.fotosMostrar.push(vid)
       this.fotos.push(this.video);

       //alert(this.video);
    },(err)=>{

    })
  }
  
  

}
