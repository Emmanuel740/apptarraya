import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginpassPageRoutingModule } from './loginpass-routing.module';

import { LoginpassPage } from './loginpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginpassPageRoutingModule
  ],
  declarations: [LoginpassPage]
})
export class LoginpassPageModule {}
