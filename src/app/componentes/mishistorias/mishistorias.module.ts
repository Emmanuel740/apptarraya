import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MishistoriasPageRoutingModule } from './mishistorias-routing.module';

import { MishistoriasPage } from './mishistorias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MishistoriasPageRoutingModule
  ],
  declarations: [MishistoriasPage]
})
export class MishistoriasPageModule {}
