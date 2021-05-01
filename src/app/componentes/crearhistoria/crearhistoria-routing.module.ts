import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearhistoriaPage } from './crearhistoria.page';

const routes: Routes = [
  {
    path: '',
    component: CrearhistoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearhistoriaPageRoutingModule {}
