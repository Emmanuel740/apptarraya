import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerhistoriaPage } from './verhistoria.page';

const routes: Routes = [
  {
    path: '',
    component: VerhistoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerhistoriaPageRoutingModule {}
