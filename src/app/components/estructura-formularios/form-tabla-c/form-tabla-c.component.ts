import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { MyUserService } from 'src/app/services/utilitarios/myUser.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { MsgTemplateService } from 'src/app/services/utilitarios/msg-template.service';

declare var window: any;
@Component({
  selector: 'app-form-tabla-c',
  templateUrl: './form-tabla-c.component.html',
  styleUrls: ['./form-tabla-c.component.scss'],
})
export class FormTablaCComponent implements OnInit {

  public titulo: string = '';
  public tipo: string = '';
  public tipo_form: string = '';
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
  }

  TablaFormularioDet: any[] = [];

  FormularioDet: any[] = [];
  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private dbQuery: DbQuery,
    private MyUser: MyUserService,
    private camera: Camera,
    private msg: MsgTemplateService) { }

  ngOnInit() {
    this.consultarTabla();
    this.consultarImagenes();
  }

  consultarTabla() {
    let sql = `SELECT d.* FROM rk_hc_form_det d
                 INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
                 WHERE d.tipo_pag = '${this.tipo}' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?`;
    this.dbQuery.consultaAll('db', sql, 'N')
      .then(item => {
        this.TablaFormularioDet = item;
        Object.entries(item).forEach(([key, element]: any) => {
          this.FormularioDet['L' + element.linea + '_' + element.nombre] = element
        })
      }).catch(err => {
        this.msg.toastMsg(err, 'error');
      });
  }

  async insertarFormulario(formulario: NgForm) {
    await Object.entries(formulario.value).forEach(async ([key, element]: any) => {
      let keyValid = key.indexOf('L');
      if (keyValid >= 0 && element.length !== 0) {
        let resultado = element.split('_');
        let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
        this.dbQuery.consultaAll('db', sql, 'N').then(result => {
          let sql1 = `SELECT count(*) as cnt, id FROM rk_hc_form_det WHERE formulario_id = ${result[0].id} and linea = ${resultado[0]} and nombre = '${resultado[1]}' and tipo_pag = '${formulario.value.tipo_pag}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? `;
          this.dbQuery.consultaAll('db', sql1, 'A')
            .then(resp => {
              let data = [
                result[0].id,
                resultado[0],
                resultado[1],
                resultado[2],
                formulario.value.tipo_pag,
                formulario.value.tipo_ubicacion,
                localStorage.getItem('id_usuario'),
                this.MyUser.dateNow()
              ];
              if (resp[0].cnt > 0) {

                this.dbQuery.db.executeSql(`UPDATE rk_hc_form_det SET formulario_id = ?, linea = ?,nombre=?,valor=?,tipo_pag=?,tipo_ubicacion=?,usuario_cre_id=?,fecha_cre=? WHERE id = ${resp[0].id}`, data).catch((err) => {
                  this.msg.toastMsg(err, 'error');
                });
              } else {

                let sql = 'INSERT INTO rk_hc_form_det (formulario_id,linea,nombre,valor,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?)';
                this.dbQuery.insertar('db', sql, data).catch((err) => {
                  this.msg.toastMsg(err, 'error');
                });
              }
              this.consultarTabla();
              this.msg.toastMsg('Registro grabado.', 'success');
            });
        }).catch(err => {
          this.msg.toastMsg(err, 'error');
        });
      }
    });
  }

  // CODIGO PARA GRABAR SECCION SUBIDA DE IMAGENES
  modoCamaraBool: boolean = true;
  modoCamara() {
    if (this.modoCamaraBool == true) {
      this.modoCamaraBool = false;
    } else {
      this.modoCamaraBool = true;
    }
  }

  tempImagesTabla: any[] = [];
  tempImagesCons: any[] = [];
  camara(info: any, tipo_pag: string, tipo_ubicacion: string) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.insertarImagen(info, tipo_pag, tipo_ubicacion, base64Image);

    }, (err) => {
      // Handle error
    });
  }


  insertarImagen(data: any, tipo_pag: string, tipo_ubicacion: string, img: any) {
    let resultado = data.split('_');
    let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
    this.dbQuery.consultaAll('db', sql, 'N').then(result => {
      let data = [
        result[0].id,
        resultado[0],
        resultado[1],
        img,
        tipo_pag,
        tipo_ubicacion,
        localStorage.getItem('id_usuario'),
        this.MyUser.dateNow()
      ];
      let sql = 'INSERT INTO rk_hc_form_files (formulario_id,linea,cuadrante,img,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?)';
      this.dbQuery.insertar('db', sql, data)
      this.consultarImagenes();
    }).catch(err => {
      this.msg.toastMsg(err, 'error');
    });
  }

  consultarImagenes() {
    let sql = `SELECT d.formulario_id,count(*) as cnt,d.linea,d.cuadrante FROM rk_hc_form_files d
               INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
               WHERE d.tipo_pag = '${this.tipo}' and d.tipo_ubicacion = 'C' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?
               GROUP BY d.cuadrante, d.linea`;
    this.dbQuery.consultaAll('db', sql, 'N')
      .then(item => {
        this.tempImagesTabla = item;
        Object.entries(item).forEach(([key, element]: any) => {
          this.tempImagesCons['L' + element.linea + '_' + element.cuadrante] = element
        })
      }).catch(err => {
        this.msg.toastMsg(err, 'error');
      });
  }


}
