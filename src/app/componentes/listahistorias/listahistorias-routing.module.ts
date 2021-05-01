import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListahistoriasPage } from './listahistorias.page';

const routes: Routes = [
  {
    path: '',
    component: ListahistoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListahistoriasPageRoutingModule {}
