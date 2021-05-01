import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MishistoriasPage } from './mishistorias.page';

const routes: Routes = [
  {
    path: '',
    component: MishistoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MishistoriasPageRoutingModule {}
