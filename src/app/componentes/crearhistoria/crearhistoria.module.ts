import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearhistoriaPageRoutingModule } from './crearhistoria-routing.module';

import { CrearhistoriaPage } from './crearhistoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearhistoriaPageRoutingModule
  ],
  declarations: [CrearhistoriaPage]
})
export class CrearhistoriaPageModule {}
