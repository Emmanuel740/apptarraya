import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PescarhistoriasPage } from './pescarhistorias.page';

const routes: Routes = [
  {
    path: '',
    component: PescarhistoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PescarhistoriasPageRoutingModule {}
