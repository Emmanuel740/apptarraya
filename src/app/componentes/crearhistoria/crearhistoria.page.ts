import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { AlertController, IonSlides, ModalController, ToastController } from '@ionic/angular';
import { HistoriasService } from '../../servicios/historias.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NetworkService } from '../../servicios/network.service';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { VerfotosPage } from '../verfotos/verfotos.page';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/File/ngx';

const STORAGE_REQ_KEY = 'historias_storage';

declare var google;
@Component({
  selector: 'app-crearhistoria',
  templateUrl: './crearhistoria.page.html',
  styleUrls: ['./crearhistoria.page.scss'],
})
export class CrearhistoriaPage implements OnInit {
  //Ion slides
  @ViewChild('slides') slides: IonSlides;
  //Configuracion fotos
  fotos: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  //Google maps
  //map = null;
  first = false;

  //markers: Marker[];
  @ViewChild('map') divMap: ElementRef;
  

  map: any;
  marker:any;
  infowindow: any;
  positionSet: any;

  respuesta: string;
  
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
  img='';
  fotosMostrar: any;
  //Audio y video
  video: any;
  audio: MediaObject;
  estatusAudio = '';
  srcAudio = '';
  constructor(private camera: Camera, private router: Router,private alerta: AlertController,
    private historias: HistoriasService,
    private geolocation: Geolocation,
    private network: NetworkService, 
    private storage: Storage,
    private webview: WebView,public actionSheetController: ActionSheetController,
    private mediaCapture: MediaCapture, 
    private media: Media, public toastController: ToastController, private file: File, private modal: ModalController) {
    this.fotos = [];
    this.fotosMostrar = [];
    this.year = this.date.getFullYear().toString();
   }
   //////////////////// Mapa
   ngOnInit() {
    this.loadMap();
    // let image = {
    //   tipo: 'imagen',
    //   src: '../assets/imagenes/logo_full.png'
    // }
    // this.fotosMostrar.push(image);
    // this.fotos.push(image)
      }
      async seleccionarUbicacion(){
        
        this.router.navigate(['/explorar'])
    
    }
      async loadMap() {
        // create a new map by passing HTMLElement
        const mapEle: HTMLElement = document.getElementById('map');
        // create LatLng object
        const myLatLng = await this.geolocation.getCurrentPosition();
        let lat = myLatLng.coords.latitude;
        let lng = myLatLng.coords.longitude;
        this.lat = lat;
        this.lon = lng;


        // create map
        this.map = new google.maps.Map(mapEle, {
          center: {lat,lng},
          zoom: 12,
          disableDefaultUI: true,
          clickabelIcons: false
        });

      

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.initMap();
          //this.getLocation();
          mapEle.classList.add('show-map');
        });
        google.maps.event.addListener(this.map, 'click', (event) => {
          console.log(event)
          let position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
          
  
          this.addMarker(position)
          console.log(position)
         
        });
        
      }
      initMap(): void {
    
        const input = document.getElementById("pac-input") as HTMLInputElement;
        
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", this.map);
      
        // Specify just the place data fields that you need.
        autocomplete.setFields(["place_id", "geometry", "name"]);
      
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      
        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById(
          "infowindow-content"
        ) as HTMLElement;
        infowindow.setContent(infowindowContent);
      
  
        const marker = new google.maps.Marker({ map: this.map });
      
        marker.addListener("click", () => {
          infowindow.open(this.map, marker);
        });
      
        autocomplete.addListener("place_changed", () => {
          infowindow.close();
      
          const place = autocomplete.getPlace();
          console.log(place);
          if (!place.geometry || !place.geometry.location) {
            return;
          }
      
          if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
          } else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);
          }
      
        });
      }
      addMarker(position) {
      
        if(this.first){
          this.marker.setMap(null);
          
        }
        
        this.first = true;
        this.lat = position.lat;
        this.lon = position.lng;
        console.log(this.marker)
        let img = {
          url: '../assets/imagenes/marcador-mapa.png',
          scaledSize: new google.maps.Size(50, 50), // scaled size
        }
        this.marker = new google.maps.Marker({
          position: position,
          map: this.map,
          draggable: true,
          icon: img
        });
        
        google.maps.event.addListener(this.marker,'drag', (event:any) =>{
           console.log(event.latLng.lat());
           console.log(event.latLng.lng());
          this.lat = event.latLng.lat();
          this.lon = event.latLng.lng();
        });
      
      }
      //////////////////////////////////////////////////////
      async presentActionSheet() {
        if(this.validarElementos()){
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
        }else{
          this.alertaElementos();
        }
        
      }
      validarElementos(){
        if(this.fotos.length === 3){
          return false;
        }else{
          return true;
        }
      }
      async alertaElementos() {
        const alert = await this.alerta.create({
          cssClass: 'my-custom-class',
          header: 'El limite de elementos se de 3',
          buttons: ['ACEPTAR']
        });
    
        await alert.present();
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
        if(this.validarElementos()){
          this.audio =  this.media.create(this.file.externalRootDirectory + 'audio.mp3');
          this.srcAudio = this.file.externalRootDirectory + 'audio.mp3';
          this.audio.startRecord();
          this.estatusAudio = 'grabando';
          this.toastAudio('Grabando audio, para detener la grabación pulsa nuevamente el botón');
          
        }else{
          this.alertaElementos();
        }
        
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
      this.base64Image =  imageData;
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
  Cancelar(){
    this.router.navigate(['/pescarhistorias']);
  }

  crearHistoria(){


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
      fotosMostrar: this.fotosMostrar,
      id: Date.now().toString(),
      dbid: this.id
  };

  this.checarInternet(story);
  
  }
  guardarHistoria(story){
    this.historias.posHistory(story,false,null).then(
      (res: any) => {
        console.log(res);
        //let respuesta = JSON.parse(res.data)
        let respuesta = res;
       // alert('respuesta historia '+respuesta);
        //this.postContent(story,respuesta.storyId);
        
      },
      (error) =>{
        console.error(error);
       // alert('error historia '+error);
      }
    );
  }
  guardarElementos(){
    let story = {
     elements: this.fotos
    }
    let r = JSON.stringify(story.elements)
    alert(r)
    this.historias.postFiles(story,143,false,null).then(
      (res: any) => {
        console.log(res);
        //let respuesta = JSON.parse(res.data)
        let respuesta = res;
       // alert('respuesta historia '+respuesta);
        //this.postContent(story,respuesta.storyId);
        
      },
      (error) =>{
        console.error(error);
       // alert('error historia '+error);
      }
    );
  }

  checarInternet(story){
    if(this.network.getCurrentNetworkStatus() === 1){
      this.alertaRed(story);
    }else{
      this.guardarHistoria(story);
    }

  }
  alertaRed(story){

    Swal.fire({
      position: 'center',
      title: 'Sin Conexión',
      text: '¿Quieres guardar la historia localmente? Podras subirla cuando tengas conexión a internet',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2dd36f',
      cancelButtonText: 'CERRAR',
      confirmButtonText: 'GUARDAR'
    }).then((result) => {
      if (result.value) {
       this.storeStory(story);
      }
    });
  }
  storeStory(story) {
    
    let action = {
      data: story,
    };
 
    this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);
 
      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
    this.alertaExito();
  }
  alertaExito(){
    Swal.fire({
      position: 'center',
      title: 'Listo',
      text: 'Podras subir tu historia cuando tengas conexión',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#2dd36f',
      confirmButtonText: 'ACEPTAR'
    });
    this.router.navigate(['/home']);
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

  
  

}
