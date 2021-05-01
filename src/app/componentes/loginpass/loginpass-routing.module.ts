import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginpassPage } from './loginpass.page';

const routes: Routes = [
  {
    path: '',
    component: LoginpassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginpassPageRoutingModule {}
