import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { MyUserService } from 'src/app/services/utilitarios/myUser.service';

@Component({
  selector: 'app-form-tabla-c',
  templateUrl: './form-tabla-c.component.html',
  styleUrls: ['./form-tabla-c.component.scss'],
})
export class FormTablaCComponent implements OnInit {

  public titulo: string = '';
  public tipo: string = '';
  public headCuadranteTable: any[];
  public maxLineas: any[];
  public maxCuadrantes: any[];
  public maxNotas: any[];

  @Input() set data(_data: any) {
    this.headCuadranteTable = Object.assign([], []);
    this.maxLineas = Object.assign([], []);
    this.maxCuadrantes = Object.assign([], []);
    this.maxNotas = Object.assign([], []);

    this.titulo = _data.nombre;
    this.tipo = _data.tipo;

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
  }

  TablaFormularioDet: any[] = [];
  constructor(public formBuilder: FormBuilder, private dbQuery: DbQuery, private MyUser: MyUserService) { }

  ngOnInit() {
    this.consultarTabla();
  }

  consultarTabla() {
    this.dbQuery.openOrCreateDB().then(db => {
      let sql = 'SELECT * FROM rk_hc_form_det WHERE estado = ?';
      this.dbQuery.consultaAll(db, sql, 'A')
        .then(item => {
          this.TablaFormularioDet = item;
        });
    });
  }

  async insertarFormulario(formulario: NgForm) {
    console.log(formulario.value);

    const array1 = Object.values(formulario.value.elemento[0]);
    await array1.forEach(async (element: string, index, array) => {
      if (element.length !== 0) {
        let resultado = element.split('_');
        let data = [
          resultado[0],
          'C' + resultado[1],
          resultado[2],
          formulario.value.tipo_pag,
          formulario.value.tipo_ubicacion,
          localStorage.getItem('id_usuario'),
          this.MyUser.dateNow()
        ];
        await this.dbQuery.openOrCreateDB().then(db => {
          let sql = 'INSERT INTO rk_hc_form_det (linea,nombre,valor,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?)';
          this.dbQuery.insertar(db, sql, data).then(console.log);
        });
      }
    });
    this.consultarTabla();

  }
}
