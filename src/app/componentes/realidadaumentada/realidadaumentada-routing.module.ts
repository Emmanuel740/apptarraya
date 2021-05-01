import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RealidadaumentadaPage } from './realidadaumentada.page';

const routes: Routes = [
  {
    path: '',
    component: RealidadaumentadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealidadaumentadaPageRoutingModule {}
