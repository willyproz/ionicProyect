import { Component, OnInit } from '@angular/core';
import { DbQuery } from '../../services/model/dbQuerys.service';

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
    this.dbQuery.openOrCreateDB().then(db => {
      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_hacienda order by nombre asc')
        .then(item => {
          this.DataHacienda = item;
        });


      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_usuario order by nombre asc')
        .then(item => {
        //  console.log(item);
          this.DataUsuario = item;
        });


      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_lote')
        .then(item => {
          //console.log(item);
          this.DataLote = item;
        });


      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_lote_det')
        .then(item => {
        //  console.log(item);
          this.DataLoteDet = item;
        });

      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_tipo_formulario_cab')
        .then(item => {
       //   console.log(item);
          this.DataTipoFormCab = item;
        });

      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_tipo_formulario_det')
        .then(item => {
        //  console.log(item);
          this.DataTipoFormDet = item;
        });


      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_tipo_muestra')
        .then(item => {
        //  console.log(item);
          this.DataTipoMuestra = item;
        });

    })

  }

}
