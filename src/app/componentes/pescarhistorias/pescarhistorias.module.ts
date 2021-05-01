import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PescarhistoriasPageRoutingModule } from './pescarhistorias-routing.module';

import { PescarhistoriasPage } from './pescarhistorias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PescarhistoriasPageRoutingModule
  ],
  declarations: [PescarhistoriasPage]
})
export class PescarhistoriasPageModule {}
