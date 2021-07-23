import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-tabla-r',
  templateUrl: './form-tabla-r.component.html',
  styleUrls: ['./form-tabla-r.component.scss'],
})
export class FormTablaRComponent implements OnInit {

  public titulo: string = '';
  public tipo: string = '';
  public n_rama: any;
  public headCuadranteTable: any[];
  public maxLineas: any[];
  public maxCuadrantes: any[];
  public maxNotas: any[];
  public headRamaTable: any[];

  @Input() set data(_data: any) {
    this.headCuadranteTable = Object.assign([], []);
    this.headRamaTable = Object.assign([], []);
    this.maxLineas = Object.assign([], []);
    this.maxCuadrantes = Object.assign([], []);
    this.maxNotas = Object.assign([], []);

    console.log(_data.id);

    this.titulo = _data.nombre;

    for (let i = 0; i < _data.n_cuadrante; i++) {
      this.headCuadranteTable.push('C' + (i + 1));
      this.maxCuadrantes.push((i + 1));
    }

    for (let i = 0; i < _data.max_linea; i++) {
      this.maxLineas.push((i + 1));
    }

    for (let i = _data.nota_min; i <= _data.nota_max; i++) {
      this.maxNotas.push((i));
    }

    for (let i = 0; i < _data.n_rama; i++) {
      this.headRamaTable.push('R' + (i + 1));
    }

  }

  constructor() { }

  ngOnInit() {}

}
