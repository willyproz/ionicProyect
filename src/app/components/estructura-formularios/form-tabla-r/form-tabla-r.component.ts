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
    this.tipo = _data.tipo;
    this.tipo_form = _data.sigla;

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
  FormularioDet: any[] = [];

  constructor(public formBuilder: FormBuilder, private dbQuery: DbQuery, private MyUser: MyUserService) { }

  ngOnInit() {
    this.consultarTabla();
  }


  consultarTabla() {
    this.dbQuery.openOrCreateDB().then(db => {
      //let sql = `SELECT * FROM rk_hc_form_det WHERE tipo_pag = '${this.tipo}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ?`;
      let sql = `SELECT d.* FROM rk_hc_form_det d
                 INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
                 WHERE d.tipo_pag = '${this.tipo}' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?`;
      this.dbQuery.consultaAll(db, sql, 'N')
        .then(async item => {
          this.TablaFormularioDet = item;
          await Object.entries(item).forEach(([key, element]: any) =>{
            this.FormularioDet['L'+element.linea+'_'+element.nombre+'_'+element.nombre2] = element
          })
          console.log(this.FormularioDet);
        });
    });
  }

  async insertarFormulario(formulario: NgForm) {
    console.log(formulario.value);
    await Object.entries(formulario.value).forEach(async ([key, element]: any) => {
      let keyValid = key.indexOf('L');
      console.log(keyValid);
      if (keyValid >= 0 && element.length !== 0) {
        let resultado = element.split('_');
        await this.dbQuery.openOrCreateDB().then(db => {
          let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
          this.dbQuery.consultaAll(db, sql, 'N').then(result => {
            //console.log('id:' + result[0].id);
            let sql1 = `SELECT count(*) as cnt, id FROM rk_hc_form_det WHERE formulario_id = ${result[0].id} and linea = ${resultado[0]} and nombre = '${resultado[1]}' and nombre2 = '${resultado[2]}' and tipo_pag = '${formulario.value.tipo_pag}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? `;
            this.dbQuery.consultaAll(db, sql1, 'A')
              .then(resp => {
                console.log(resp);
                let data = [
                  result[0].id,                         //id formulario
                  resultado[0],                         //linea
                  resultado[1],                   //cuadrante
                  resultado[2],                   //rama
                  resultado[3],                         //valor rama
                  formulario.value.tipo_pag,            //tipo_pag
                  formulario.value.tipo_ubicacion,      //tipo_ubicacion
                  localStorage.getItem('id_usuario'),   //usuario_id
                  this.MyUser.dateNow()                 //fecha_cre
                ];
                if (resp[0].cnt > 0) {
                  db.executeSql(`UPDATE rk_hc_form_det SET formulario_id = ?, linea = ?,nombre=?,nombre2=?,valor2=?,tipo_pag=?,tipo_ubicacion=?,usuario_cre_id=?,fecha_cre=? WHERE id = ${resp[0].id}`, data)
                } else {
                  let sql = 'INSERT INTO rk_hc_form_det (formulario_id,linea,nombre,nombre2,valor2,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
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
