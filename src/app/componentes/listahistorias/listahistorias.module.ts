import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListahistoriasPageRoutingModule } from './listahistorias-routing.module';

import { ListahistoriasPage } from './listahistorias.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    ListahistoriasPageRoutingModule
  ],
  declarations: [ListahistoriasPage]
})
export class ListahistoriasPageModule {}
