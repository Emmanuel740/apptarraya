import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirhistoriaPageRoutingModule } from './subirhistoria-routing.module';

import { SubirhistoriaPage } from './subirhistoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirhistoriaPageRoutingModule
  ],
  declarations: [SubirhistoriaPage]
})
export class SubirhistoriaPageModule {}
