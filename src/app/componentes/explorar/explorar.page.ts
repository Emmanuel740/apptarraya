import { Component, NgZone, OnInit } from '@angular/core';
import { HistoriasService } from '../../servicios/historias.service';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { VerhistoriaPage } from '../verhistoria/verhistoria.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}
@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
  map = null;
  stories: any;
  infowindow: any;
  markers: Marker[] = [
    {
      position: {
        lat: 4.658383846282959,
        lng: -74.09394073486328,
      },
      title: 'Parque Simón Bolivar'
    }
  ];
  lat: any;
  lon: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  busqueda;
  constructor(private historias: HistoriasService, 
              private router: Router, 
              private loading: LoadingController,
              private modal: ModalController,
              private geolocation: Geolocation,
              public zone: NgZone,) { 
    this.stories = [];
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.loadMap();
      }
      async getHistorias(){
       // minlon, minlat, , 
       //maxlon, maxlat , 

       const loading = await this.loading.create({
        cssClass: 'my-custom-class',
      });
      await loading.present();
        console.log('lat: '+this.lat+ 'lon: '+this.lon);
        
        
        // this.lat = 4.6486259;
        // this.lon = -74.2478958;
        let minlon = (this.lon-30);
        let minlat = (this.lat-30);
        let maxlon = (this.lon+30)
        let maxlat = (this.lat+30);
        console.log(minlon,minlat,maxlon,maxlat)
        this.historias.getStoriesByLocation(minlon,minlat,maxlon,maxlat).then(
          (res: any) => {
            loading.dismiss();
            this.stories = res;
            //this.stories = JSON.parse(res.data);
            console.log(res);
            this.editarHistorias();
          },
          (error) =>{
            loading.dismiss();
            alert(error);
            console.error(error);
          }
        );
      }
      async loadMap() {
        // create a new map by passing HTMLElement
        const mapEle: HTMLElement = document.getElementById('map');
        // create LatLng object
        //const myLatLng = {lat: 11, lng: -74};
        const myPosyition = await this.geolocation.getCurrentPosition();
        const myLatLng = {lat: myPosyition.coords.latitude , lng: myPosyition.coords.longitude};
        this.lat = myLatLng.lat;
        this.lon = myLatLng.lng;
        console.log(myLatLng)
        // create map
        this.map = new google.maps.Map(mapEle, {
          center: myLatLng,
          zoom: 12,
          disableDefaultUI: true,

        });
        
      
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
         // this.renderMarkers();
         this.initMap();
         this.getHistorias();

          mapEle.classList.add('show-map');
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
      addMarker(marker) {
        console.log(marker);
        let img = {
          url: '../assets/imagenes/marcador-mapa.png',
          scaledSize: new google.maps.Size(50, 50), // scaled size
        }
        const Mar = new google.maps.Marker({
          position: marker.position,
          map: this.map,
          title: marker.name,
          id: marker.id,
          icon: img
        });
        this.infowindow = new google.maps.InfoWindow();


        google.maps.event.addListener(Mar,'click', (event:any) =>{
          console.log(marker.storyid);
          this.verHistoria(marker.storyid);
          // console.log(event.latLng.lng());
          // this.lat = event.latLng.lat();
          // this.lon = event.latLng.lng();
          this.setInfoWindow(Mar, 'Historia', marker.name);

        });

      }
      setInfoWindow(marker: any, tiutlo: string, subtitulo:string){
        const contentString = '<div id="contentInsideMap">'+
                              '<div>'+
                              '</div>'+
                              '<p style="font-weight: bold; margin-bottom: 5px;">'+tiutlo+'</p>'+
                              '<div id="bodyContent">'+
                              '<p>'+subtitulo+'</p>'+
                              '<div>'+
                              '</div>';
                              this.infowindow.setContent(contentString);
                              this.infowindow.open(this.map,marker);
                            
    
    
      }
      renderMarkers(historias: any) {
        historias.forEach(historia => {
          this.addMarker(historia);
        });
      }
      editarHistorias(){
        let historias = [];
        for(let his of this.stories){
           let story = {
             position:{
               lat: parseFloat(his.location_lat),
               lng: parseFloat(his.location_lon)
             },
             storyid:his.id,
             name: his.name
           };
           historias.push(story);
        }
        this.renderMarkers(historias);

      }
      search(){
        this.router.navigate(['/listahistorias'])
      }

      async verHistoria(id){
        let navigationExtras: NavigationExtras = {
          queryParams: {
              id
          }
      };
      
        this.router.navigate(['verhistoria'], navigationExtras)
      
    
    }
////////////////Busqueda google

UpdateSearchResults(){
  if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
  (predictions, status) => {
    this.autocompleteItems = [];
    this.zone.run(() => {
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    });
  });
}
ClearAutocomplete(){
  this.autocompleteItems = []
  this.autocomplete.input = ''
}
SelectSearchResult(item) {

  //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
  //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
  alert(JSON.stringify(item)) 
  console.log(item)     
  this.placeid = item.place_id
}

// SeleccionarHistoria(story){
//    this.busqueda = '';
//    console.log(story); 
  
//    const myLatLng = {lat: parseFloat(story.location_lat) , lng: parseFloat(story.location_lon)};
//    this.map.setCenter(myLatLng)
//    this.map.setZoom(17);

// } 
}

