import { Injectable } from '@angular/core';
import { Router, NavigationExtras} from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {
  url: string;
  constructor(private httpClient: HttpClient, private router: Router) { 
    this.url = environment.urlApi;
  }

  async RegistarUsuario(userRegisterData) {
    //console.log(this.network.getCurrentNetworkStatus());
    let registerData = new FormData();
    registerData.append('name', userRegisterData.name);
    registerData.append('username', userRegisterData.username);
    registerData.append('email', userRegisterData.email);
    registerData.append('password', userRegisterData.password);
    registerData.append('password_confirmation', userRegisterData.password_confirmation);

  
      
      // console.log(username);
      // console.log(password);
      return this.httpClient.post(`${this.url}api/register`, registerData).toPromise();//.subscribe(

      
  }
}
