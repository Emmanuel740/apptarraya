import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubirhistoriaPage } from './subirhistoria.page';

const routes: Routes = [
  {
    path: '',
    component: SubirhistoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubirhistoriaPageRoutingModule {}
