import { Component, OnInit } from '@angular/core';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
//import { DbQuery } from '../../services/model/dbQuerys.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  constructor(private dbQuery: DbQuery) { }

  DataHacienda: any[] = [];
  DataUsuario: any[] = [];
  DataLote: any[] = [];
  DataLoteDet: any[] = [];
  DataTipoFormCab: any[] = [];
  DataTipoFormDet: any[] = [];
  DataTipoMuestra: any[] = [];
  //consultaAll
  ngOnInit() {
    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_hacienda WHERE estado = ?', 'A')
      .then(item => {
        this.DataHacienda = item;
      });


    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_usuario WHERE estado = ?', 'A')
      .then(item => {
        //  console.log(item);
        this.DataUsuario = item;
      });


    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_lote WHERE estado = ?', 'A')
      .then(item => {
        //console.log(item);
        this.DataLote = item;
      });


    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_lote_det WHERE estado = ?', 'A')
      .then(item => {
        //  console.log(item);
        this.DataLoteDet = item;
      });

    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_tipo_formulario_cab WHERE estado = ?', 'A')
      .then(item => {
        //   console.log(item);
        this.DataTipoFormCab = item;
      });

    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_tipo_formulario_det WHERE estado = ?', 'A')
      .then(item => {
        //  console.log(item);
        this.DataTipoFormDet = item;
      });


    this.dbQuery.consultaAll('db', 'SELECT * FROM rk_hc_tipo_muestra WHERE estado = ?', 'A')
      .then(item => {
        //  console.log(item);
        this.DataTipoMuestra = item;
      });
  }

}
