import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealidadaumentadaPageRoutingModule } from './realidadaumentada-routing.module';

import { RealidadaumentadaPage } from './realidadaumentada.page';
//import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //NgxQRCodeModule,
    RealidadaumentadaPageRoutingModule
  ],
  declarations: [RealidadaumentadaPage]
})
export class RealidadaumentadaPageModule {}
