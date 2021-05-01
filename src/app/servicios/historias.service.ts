import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { File,FileEntry } from '@ionic-native/File/ngx';

const STORAGE_REQ_KEY = 'historias_storage';

const APP_DIRECTORY_NAME = 'App-Tarraya';

@Injectable({
  providedIn: 'root'
})
export class HistoriasService {
  url: string;
  formulario: FormData;

  constructor(private http: HttpClient,
    private router: Router, private loading: LoadingController, 
    private storage: Storage, private file: File) { 
    this.url = environment.urlApi;
  }
  async getStoriesByLocation(minlon,minlat,maxlon,maxlat) {
    
    console.log('entro');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`
    });
    console.log(headers);
    
    return await this.http.get(`${this.url}api/stories-location?minlon=${minlon}&minlat=${minlat}&maxlon=${maxlon}&maxlat=${maxlat}`,{headers}).toPromise();
    
  }
  
  async getMyStories() {
    
    console.log('entro');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`
    });
    console.log(headers);
    return await this.http.get(`${this.url}api/user/stories`,{headers}).toPromise();
    
  }
  async deleteStory(id){
    
    console.log('entro');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`
    });
    console.log(headers);
    return await this.http.post(`${this.url}api/story-destroy/${id}`,{headers}).toPromise();
    
  }
  
  async getStoriesList() {
  
    console.log('entro');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`,
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Accept':'application/json',
      'content-type':'application/json'
    });
    console.log(headers);
    return await this.http.get(`${this.url}api/stories-list`).toPromise();
    
  }
  

  async getStory(id) {
    
    console.log('entro');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`
    });
    console.log(headers);
    return await this.http.get(`${this.url}api/story/${id}`,{headers}).toPromise();
    
  }
  
  async posHistory(story,islocal,posicion) {
    console.log(story)
    let id;
    let storyFormData = new FormData();
        storyFormData.append('name', story.name)
        storyFormData.append('location_name', story.location_name)
        storyFormData.append('location_lat', story.location.latitude)
        storyFormData.append('location_lon', story.location.longitude)
        storyFormData.append('id', story.dbid);
        storyFormData.append('description', story.description ? story.description : '');

    console.log('entro');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`
    });
    console.log(headers);
    const loading = await this.loading.create();
    await loading.present();
    this.http.post(`${this.url}api/story`,
    storyFormData
    ,{headers}).subscribe(
          (res: any) => {
            console.log(res);
            let respuesta = res;
            id = respuesta.storyId;
          // alert('respuesta historia '+respuesta);
            this.postStoryContent(story,respuesta.storyId,islocal,posicion);
            
          },
          (error) =>{
            console.error(error);
            loading.dismiss();
            alert('error post historia')
            return error;
          }
        );

    
  }
  enviar(story,islocal,posicion){
    
  }

  getStoryContentObject(storyObject,id) {
    let contentObject = {
        files: [],
        elements: [],
        directoryUrl: '//la-piragua.s3.us-east-2.amazonaws.com/uploads/stories/' + id + '-files/'
    };

    
    for (let i = 0; i < storyObject.elements.length; i++) {
        const element = storyObject.elements[i];
        if (element) {
            const elementFilename = element.replace(/^.*[\\\/]/, '');
            const elementObject = {
                file: elementFilename,
                content: '',
                isPanoramic: false
            };
            contentObject.files.push(elementFilename);
            contentObject.elements.push(elementObject);
        }
    }

    return contentObject;
}

async postStoryContent(story,id,islocal,posicion){
  let storyFormData = new FormData();
  const storyContent = this.getStoryContentObject(story,id);
  //let im = JSON.stringify(storyContent)
  //alert(im)
  storyFormData.append('content', JSON.stringify(storyContent));
  console.log('entro');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${environment.accessToken}`
  });
  return await this.http.post(`${this.url}api/story-content/${id}`,
  storyFormData
  ,{headers}).subscribe(
    data => {
      console.log(data);

      this.postFeaturedImage(story,id,islocal,posicion);
      //this.publicStory(id);
    },
    (err) => {
      console.log(err);
      alert('error post content')
      let r = JSON.stringify(err);
     // alert(r);
      this.loading.dismiss();

      
    }


  );

}




async postFeaturedImage(story,id,islocal,posicion){
   
  if (story.featured_image) {
    let formulario = new FormData();
    this.getFormulario(story.featured_image,'featured_image')
    .then((result) => {
      formulario = result;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${environment.accessToken}`,
      });

      return this.http.post(`${this.url}api/story-featured-image/${id}`,
      formulario
      ,{headers}).subscribe(
             (res: any) => {

               this.postFiles(story,id,islocal,posicion)
             },
             (error) =>{
               console.error(error);
               alert('error post image')
               this.loading.dismiss();

             }
           );


    }, err => {


      console.log(err);
    });

    
  }else{
    console.log('no imagen')
    this.postFiles(story,id,islocal,posicion)

  }  
}
async postFiles(story,id,islocal,posicion){
   
  if (story.elements) {
    for(let elemento of story.elements){
    //alert(elemento)
    let formulario = new FormData();
    this.getFormulario(elemento,'fileToUpload')
    .then((result) => {
      formulario = result;
      const headers = new HttpHeaders({
        Authorization: `Bearer ${environment.accessToken}`,
      });

      return this.http.post(`${this.url}api/story-files/${id}`,
      formulario
      ,{headers}).subscribe(
             (res: any) => {

            //alert('exito subiendo elemento')
             },
             (error) =>{
               console.error(error);
               ///let err = JSON.stringify(error)
               alert('error post element: '+error)
               //alert(err);
               this.loading.dismiss();

             }
           );


    }, err => {


      console.log(err);
    });

  }
  this.publicStory(id,islocal,posicion)

  }else{
    console.log('no imagen')
    this.publicStory(id,islocal,posicion)

  }  
}

getFormulario(URIimage,campo): Promise<any>{
  let promesa = new Promise((resolve, reject) => {
    let formulario = new FormData();
    //this.stack_aux = [];

            this.file.resolveLocalFilesystemUrl(URIimage)
            .then((entry) =>
                (<FileEntry>entry).file(file =>  {
                    const reader = new FileReader();
                    reader.onload = (data) => {


                        console.log("Entre");

                        const imgBlob = new Blob([reader.result], { type: file.type });
                        formulario.append(campo, imgBlob, file.name);



                        //this.stack_aux.push('foto' + (i+1));
                        //if(this.stack_aux.length == fotos.length)
                          resolve(formulario)



                    };
                    reader.readAsArrayBuffer(file);
            })).catch( err =>{
                    reject(err)
                })
            .catch( err =>
                reject(err)
            );        
  });

  return promesa;
}

async publicStory(id,islocal,posicion){
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`
    });
    
    return await this.http.post(`${this.url}api/story-public/${id}`,{
    
    }
    ,{headers}).subscribe(
      data => {
        console.log(data);
     if(islocal){
       this.eliminarHistoriaLocal(posicion);
     }
     this.loading.dismiss();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Listo!',
        text: 'Tu historia ha sido registrada con exito',
        showConfirmButton: true         
      });
      this.router.navigate(['/home']);
   
        
      },
      (err) => {
        console.log(err);
        alert('error post public story')

        Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo guardar la historia',
                  showConfirmButton: true         
                });
                this.loading.dismiss();
      }
  
  
    );
}


eliminarHistoriaLocal(posicion){
  alert(posicion);
  this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
    let storedObj = JSON.parse(storedOperations);

    storedObj.splice(posicion,1);
    // Save old & new local transactions back to Storage
    this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
  });
}


 getFileType(filePath) {
                
  const fileName = filePath.replace(/^.*[\\\/]/, '');
  //console.log("File: "+fileName.split('.').pop());
  const fileExtension =  (fileName.substr(fileName.lastIndexOf('.') + 1)).toLowerCase();        

  let fileType = '';
  switch (fileExtension) {
      case 'jpg':
          fileType = 'image/jpeg';
          break;
          
      case 'jpeg':
          fileType = 'image/jpeg';
          break;
          
      case 'png':
          fileType = 'image/png';
          break;
          
      case 'gif':
          fileType = 'image/gif';
          break;
          
      case 'bmp':
          fileType = 'image/bmp';
          break;
          
      case 'bmp':
          fileType = 'image/bmp';
          break;
          
      case 'mp4':
          fileType = 'video/mp4';
          break;
          
      case 'm4v':
          fileType = 'video/mp4';
          break;
          
      case 'mp3':
          fileType = 'audio/mp3';
          break;
          
      case 'm4a':
          fileType = 'audio/mp4';
          break;
          
      case 'ogg':
          fileType = 'application/ogg';
          break;
          
      default:
          fileType = 'application/octet-stream';
          break;
  }
  return fileType;
}
}
