import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { File,FileEntry } from '@ionic-native/File/ngx';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string;
  constructor(private http: HttpClient,private file: File) { 
    this.url = environment.urlApi;
  }
  // async getUser() {
    
  //   console.log('entro');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${environment.accessToken}`
  //   });
  //   console.log(headers);
  //   return await this.http.get(`${this.url}api/user`,{headers}).toPromise();
    
  // }

  async getUser() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.accessToken}`,
    });
    return this.http.get(`${this.url}api/user`, {
     headers
    }).toPromise();
    
    
  }
  async editUser(user) {
    let userFormData = new FormData();
    
  
    this.getFormulario(user.picture)
    .then((result) => {
     // alert('tiene resultado')

     userFormData = result;
     console.log(userFormData)
     userFormData.append('name', user.name);
     userFormData.append('username', user.username);
     userFormData.append('email', user.email);
     userFormData.append('description', user.description);
 
 
 
     const headers = new HttpHeaders({
       Authorization: `Bearer ${environment.accessToken}`,
     });
     console.log('post')
     return this.http.post(`${this.url}api/user`, 
     userFormData, 
     { headers
     }).toPromise();
     
    },(err)=>{

    })

    
    
    
  }
  editarUsertest(user){
    let userFormData = new FormData();
    userFormData.append('name', user.name);
     userFormData.append('username', user.username);
     userFormData.append('email', user.email);
     userFormData.append('description', user.description);
 
 
 
     const headers = new HttpHeaders({
       Authorization: `Bearer ${environment.accessToken}`,
     });
     console.log('post')
     return this.http.post(`${this.url}api/user`, 
     userFormData, 
     { headers
     }).toPromise();
  }
  getFormulario(URIimage): Promise<any>{
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
                          formulario.append('picture', imgBlob, file.name);
  
  
  
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

  
}
