import { Component } from '@angular/core';
import { DbService } from 'src/app/services/model/db.service';

interface Componente{
  icon:string;
  name:string;
  color:string;
  redirecTo:string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage {

  componentes:Componente[]=[
    {
      icon:'newspaper',
      name:'Mancha Angular',
      color:'danger',
      redirecTo:'/action-sheet'
    }
  ];

  menuTemp   = [
    {'nombre':  'MANCHA ANGULAR', 'icono' : 'print', 'clase' : 'Comex', 'ruta' : '/action-sheet', 'estado' : ''},
    {'nombre':  'MALFORMACION Y MICROACARO', 'icono' : 'ticket', 'clase' : 'Compras', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre':  'OÍDIO', 'icono' : 'eye', 'clase' : 'Planta', 'ruta' : '#', 'estado': 'disabled'},
    {'nombre' : 'MUERTE DESCENDENTE', 'icono' : 'cubes', 'clase' : 'Contabilidad', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'PULGON', 'icono' : 'archive', 'clase' : 'RRHH', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'TRIPS', 'icono': 'building-o', 'clase': 'DOCUMENTACION', 'ruta' : '#', 'estado': 'disabled'},
    {'nombre' : 'MANCHA DE ALTERNARIA', 'icono' : 'columns', 'clase' : 'Contabilidad', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'ANTRACNOSIS', 'icono' : 'list-ul ', 'clase' : 'Inventario', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'ENEMIGOS NATURALES', 'icono' : 'clock-o', 'clase' : 'RRHH', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'COCHINILLA', 'icono' : 'columns', 'clase' : 'Planta', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'MOSCA DE FRUTA', 'icono' : 'columns', 'clase' : 'Comex', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'LEPIDÓPTEROS', 'icono' : 'columns', 'clase' : 'Contabilidad', 'ruta' : '#', 'estado' : 'disabled'},
    {'nombre' : 'OTRAS PLAGAS', 'icono' : 'columns', 'clase' : 'Compras', 'ruta' : '#', 'estado' : 'disabled'},
 ];



 menuTempUtilitarios   = [
  {'nombre':  'DESCARGAR DATOS', 'icono' : 'refresh', 'clase' : 'Comex', 'ruta' : `syncronize()`, 'estado' : ''},
  {'nombre':  'SUBIR DATOS', 'icono' : 'upload', 'clase' : 'Planta', 'ruta' : '#', 'estado' : 'disabled'},
];
  constructor(private db:DbService) { }

  syncronize(){
  this.db.syncData();
 // console.log(this.db.syncData());
  }
}
