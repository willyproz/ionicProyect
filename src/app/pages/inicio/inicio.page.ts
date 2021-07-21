import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  menuTemp   = [
    {'nombre':  'ADMINISTRAR', 'icono' : 'print', 'clase' : 'Comex', 'ruta' : '#', 'estado' : ''},
    {'nombre':  'CONSULTAR', 'icono' : 'ticket', 'clase' : 'Compras', 'ruta' : '/consulta', 'estado' : 'disabled'},
    {'nombre':  'FORMULARIOS', 'icono' : 'eye', 'clase' : 'Planta', 'ruta' : '/formulario', 'estado': 'disabled'},
 ];
}
