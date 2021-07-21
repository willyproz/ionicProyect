import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormInicioComponent } from './estructura-formularios/form-inicio/form-inicio.component';
import { FormTablaCComponent } from './estructura-formularios/form-tabla-c/form-tabla-c.component';
import { FormTablaRComponent } from './estructura-formularios/form-tabla-r/form-tabla-r.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    HeaderComponent,
    FormInicioComponent,
    FormTablaCComponent,
    FormTablaRComponent
  ],
  exports:[
    HeaderComponent,
    FormInicioComponent,
    FormTablaCComponent,
    FormTablaRComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
