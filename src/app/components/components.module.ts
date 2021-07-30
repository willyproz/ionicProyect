import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormInicioComponent } from './estructura-formularios/form-inicio/form-inicio.component';
import { FormTablaCComponent } from './estructura-formularios/form-tabla-c/form-tabla-c.component';
import { FormTablaRComponent } from './estructura-formularios/form-tabla-r/form-tabla-r.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstilosMenuDashbboardComponent } from './estilos-menu-dashbboard/estilos-menu-dashbboard.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FormInicioComponent,
    FormTablaCComponent,
    FormTablaRComponent,
    EstilosMenuDashbboardComponent
  ],
  exports:[
    HeaderComponent,
    FormInicioComponent,
    FormTablaCComponent,
    FormTablaRComponent,
    EstilosMenuDashbboardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
