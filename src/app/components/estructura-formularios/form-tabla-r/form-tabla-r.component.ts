import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { MyUserService } from 'src/app/services/utilitarios/myUser.service';

@Component({
  selector: 'app-form-tabla-r',
  templateUrl: './form-tabla-r.component.html',
  styleUrls: ['./form-tabla-r.component.scss'],
})
export class FormTablaRComponent implements OnInit {

  public titulo: string = '';
  public tipo: string = '';
  public tipo_form: string = '';
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

  TablaFormularioDet: any[] = [];
  constructor(public formBuilder: FormBuilder, private dbQuery: DbQuery, private MyUser: MyUserService) { }

  ngOnInit() { }


  consultarTabla() {
    this.dbQuery.openOrCreateDB().then(db => {
      let sql = `SELECT * FROM rk_hc_form_det WHERE tipo_pag = '${this.tipo}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ?`;
      this.dbQuery.consultaAll(db, sql, 'A')
        .then(item => {
          this.TablaFormularioDet = item;
        });
    });
  }

  async insertarFormulario(formulario: NgForm) {
    await Object.entries(formulario.value).forEach(async ([key, element]: any) => {
      let keyValid = key.indexOf('L');
      console.log(keyValid);
      if (keyValid >= 0 && element.length !== 0) {
        let resultado = element.split('_');
        await this.dbQuery.openOrCreateDB().then(db => {
          let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and estado = ? ORDER BY id DESC LIMIT 1`;
          this.dbQuery.consultaAll(db, sql, 'A').then(result => {
            console.log('id:' + result[0].id);
            let sql1 = `SELECT count(*) as cnt, id FROM rk_hc_form_det WHERE formulario_id = ${result[0].id} and linea = ${resultado[0]} and nombre = '${'C' + resultado[1]}' and tipo_pag = '${formulario.value.tipo_pag}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? `;
            this.dbQuery.consultaAll(db, sql1, 'A')
              .then(resp => {
                console.log(resp);
                let data = [
                  result[0].id,
                  resultado[0],
                  'C' + resultado[1],
                  resultado[2],
                  formulario.value.tipo_pag,
                  formulario.value.tipo_ubicacion,
                  localStorage.getItem('id_usuario'),
                  this.MyUser.dateNow()
                ];
                if (resp[0].cnt > 0) {
                  db.executeSql(`UPDATE rk_hc_form_det SET formulario_id = ?, linea = ?,nombre=?,valor=?,tipo_pag=?,tipo_ubicacion=?,usuario_cre_id=?,fecha_cre=? WHERE id = ${resp[0].id}`, data)
                } else {
                  let sql = 'INSERT INTO rk_hc_form_det (formulario_id,linea,nombre,valor,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?)';
                  this.dbQuery.insertar(db, sql, data);
                }
                this.consultarTabla();
              });
          });
        });
      }
    });
  }


}
