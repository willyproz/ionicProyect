import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstructuraFormulariosPageRoutingModule } from './estructura-formularios-routing.module';

import { EstructuraFormulariosPage } from './estructura-formularios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstructuraFormulariosPageRoutingModule
  ],
  declarations: [EstructuraFormulariosPage]
})
export class EstructuraFormulariosPageModule {}
