import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/model/db.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private Dbservices:DbService) { }

  ngOnInit() {
  }

  menuTemp   = [
    {'nombre':  'ADMINISTRAR', 'icono' : 'print', 'clase' : 'Comex', 'ruta' : '', 'estado' : ''},
    {'nombre':  'CONSULTAR', 'icono' : 'ticket', 'clase' : 'Compras', 'ruta' : '/consulta', 'estado' : 'disabled'},
    {'nombre':  'FORMULARIOS', 'icono' : 'eye', 'clase' : 'Planta', 'ruta' : '/formulario', 'estado': 'disabled'},
 ];

}
