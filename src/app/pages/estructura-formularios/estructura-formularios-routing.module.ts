import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstructuraFormulariosPage } from './estructura-formularios.page';

const routes: Routes = [
  {
    path: '',
    component: EstructuraFormulariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstructuraFormulariosPageRoutingModule {}
