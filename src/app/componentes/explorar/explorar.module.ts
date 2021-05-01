import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorarPageRoutingModule } from './explorar-routing.module';

import { ExplorarPage } from './explorar.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    ExplorarPageRoutingModule
  ],
  declarations: [ExplorarPage]
})
export class ExplorarPageModule {}
