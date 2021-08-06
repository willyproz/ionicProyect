import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MsgTemplateService } from '../../../services/utilitarios/msg-template.service';
import { DbQuery } from '../../../services/model/dbQuerys.service';
import { MyUserService } from '../../../services/utilitarios/myUser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-inicio',
  templateUrl: './form-inicio.component.html',
  styleUrls: ['./form-inicio.component.scss'],
})

export class FormInicioComponent implements OnInit {

  tipo_formulario: any = '';

  @Input() tituloTabla: string = '';
  @Input() set tipo_form(_data: any) {
    this.tipo_formulario = _data;
    if(this.TablaFormularioCab.length < 1){
      this.llenarSelects();
    }
    this.consultarTabla();
  };

  constructor(
    public formBuilder: FormBuilder,
    private dbQuery: DbQuery,
    private msg: MsgTemplateService,
    private MyUser: MyUserService,
    private router: Router,
  ) {
    this.SelectUsuario = [
      {
        codigo: localStorage.getItem('id_usuario'),
        descripcion: localStorage.getItem('nombre'),
      }
    ]
  }


  ionViewWillEnter() {
    this.consultarTabla();
  }

  SelectHacienda: any[] = [];
  SelectUsuario: any[] = [];
  SelectLote: any[] = [];
  SelectModulo: any[] = [];
  SelectTipoMuestra: any[] = [];
  TablaFormularioCab: any[] = [];
  FormularioCab: any[] = [{
    hacienda_id: 0
  }];

  llenarSelects() {

    let sqlHacienda = `select rhh.id as codigo, rhh.nombre as descripcion
                       from rk_hc_persona_formulario_hacienda rp
                       left join rk_hc_hacienda rhh on rhh.id = rp.hacienda_id
                       left join rk_hc_formulario rf on rf.id = rp.formulario_id
                       where rp.usuario_id = ${localStorage.getItem('id_usuario')} and rf.sigla = '${this.tipo_formulario}' and rp.estado = ?
                       GROUP BY rp.hacienda_id`;

    this.dbQuery.consultaAll('db', sqlHacienda, 'A')
      .then(item => {
        this.SelectHacienda = item;

      }).catch(e => {
        this.msg.msgError(e);
      });

    this.dbQuery.consultaAll('db', 'SELECT id as codigo, nombre as descripcion FROM rk_hc_tipo_muestra WHERE estado = ?', 'A')
      .then(item => {
        this.SelectTipoMuestra = item;
      }).catch(e => {
        this.msg.msgError(e);
      });
  }

  ngOnInit() {
    // this.consultarTabla();
    this.Formulario = this.formBuilder.group({
      responsable_id: [''],
      hacienda_id: [''],
      lote_id: [''],
      modulo_id: [''],
      tipo_muestra_id: ['']
    });

  }

  Formulario: FormGroup = this.formBuilder.group({
    hacienda_id: [''],
    lote_id: [''],
    modulo_id: [''],
    responsable_id: [''],
    tipo_muestra_id: ['']
  });

  onChangeLote($event) {
    if (this.FormularioCab.length < 2) {
      let id = $event.target.value > 0 ? $event.target.value : 0;
      if (id > 0) {

        let sql = `SELECT id as codigo, lote as descripcion FROM rk_hc_lote WHERE hacienda_id = ${id} and estado = ? `;
        this.dbQuery.consultaAll('db', sql, 'A')
          .then(item => {
            this.Formulario.patchValue({lote_id:'',modulo_id:''});
            this.SelectModulo= [];
            this.SelectLote = item;
          }).catch(e => {
            console.log('loteCons' + e.message);
            this.msg.msgError(e);
          });;
      }
    }
  }

  onChangeModulo($event) {
    if (this.FormularioCab.length < 2) {
      let id = $event.target.value > 0 ? $event.target.value : 0;
      if (id > 0) {
        let sql = `SELECT id as codigo, modulo as descripcion FROM rk_hc_lote_det WHERE lote_id = ${id} and estado = ? `;
        this.dbQuery.consultaAll('db', sql, 'A')
          .then(item => {
            this.SelectModulo = item;
            console.log(this.SelectModulo);
          }).catch(e => {
            console.log('moduloCons' + e.message);
            this.msg.msgError(e);
          });
      }
    }
  }

  consultarTabla() {
    let sql = `SELECT rh.nombre as hacienda, rl.lote,rld.modulo,rtm.nombre as tipo_muestra FROM rk_hc_form_cab rc
              LEFT JOIN  rk_hc_lote rl on rl.id = rc.lote_id
              LEFT JOIN  rk_hc_lote_det rld on rld.id = rc.modulo_id
              LEFT JOIN  rk_hc_tipo_muestra rtm on rtm.id = rc.tipo_muestra_id
              LEFT JOIN  rk_hc_hacienda rh on rh.id = rc.hacienda_id
              WHERE rc.tipo_form = '${this.tipo_formulario}'
              and rc.usuario_cre_id = ${localStorage.getItem('id_usuario')}
              and rc.liquidado = ?`;
    this.dbQuery.consultaAll('db', sql, 'N')
      .then(item => {
        this.FormularioCab = item;
        //console.log(this.FormularioCab);
      }).catch(e => {
        console.log('query formularioCab' + e.message);
        this.msg.msgError(e);
      });

    let sql1 = `SELECT ca.tipo_form, ca.id, rhh.nombre as hacienda, ca.lote_id,ca.modulo_id, tm.nombre as tipo_muestra , ca.estado,rhu.nombre as usuario_cre, ca.fecha_cre, ca.liquidado FROM rk_hc_form_cab ca LEFT JOIN rk_hc_hacienda rhh on rhh.id = ca.hacienda_id LEFT JOIN rk_hc_tipo_muestra tm on tm.id = ca.tipo_muestra_id LEFT JOIN rk_hc_usuario rhu on rhu.id = ca.usuario_cre_id WHERE ca.tipo_form = '${this.tipo_formulario}' and ca.usuario_cre_id = ${localStorage.getItem('id_usuario')} and ca.liquidado = ?`;
    this.dbQuery.consultaAll('db', sql1, 'N')
      .then(item => {
        this.TablaFormularioCab = item;
      }).catch(e => {
        console.log('query tablaCab' + e.message);
        this.msg.msgError(e);
      });
  }

  validarFormulario(formulario) {
    let formValid = true;
    let mensaje = '<ul>';
    if (formulario.value.hacienda_id.length > 0 && formulario.value.hacienda_id > 0) {

    } else {
      formValid = false;
      mensaje += '<li>DEBE SELECCIONAR UNA HACIENDA.</li>';
    }

    if (formulario.value.lote_id.length > 0) {

    } else {
      formValid = false;
      mensaje += '<li>DEBE SELECCIONAR UN LOTE.</li>';
    }

    if (formulario.value.tipo_muestra_id.length > 0) {

    } else {
      formValid = false;
      mensaje += '<li>DEBE SELECCIONAR UN TIPO DE MUESTRA.</li>';
    }
    mensaje += '</ul>';
    return {
      estado: formValid,
      mensaje: mensaje
    }
  }

  insertarFormulario() {
    let formValid = this.validarFormulario(this.Formulario);
    if (formValid.estado === true) {
      let sql = `SELECT count(*) as cnt FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_formulario}' and liquidado = ? `;
      this.dbQuery.consultaAll('db', sql, 'N')
        .then(resp => {
          if (resp[0].cnt < 1) {

            this.msg.msgConfirmar().then((result) => {
              if (result.isConfirmed) {
                if (formValid.estado === true) {
                  let data = [
                    this.tipo_formulario,
                    this.Formulario.value.hacienda_id,
                    this.Formulario.value.lote_id,
                    this.Formulario.value.modulo_id,
                    this.Formulario.value.tipo_muestra_id,
                    localStorage.getItem('id_usuario'),
                    this.MyUser.dateNow()
                  ];
                  /* this.dbQuery.openOrCreateDB().then(db => {*/
                  this.dbQuery.insertar('db', 'INSERT INTO rk_hc_form_cab (tipo_form,hacienda_id,lote_id,modulo_id,tipo_muestra_id,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?)', data)
                    .then(() => {
                      if (this.dbQuery.respuesta.estado === 'ok') {
                        this.Formulario.reset({
                          responsable_id: localStorage.getItem('id_usuario')
                        });
                        this.msg.toastMsg('Grabado con exito', 'success');
                        this.consultarTabla();
                      } else {
                        this.msg.msgError('No se pudo agregar formulario a la Base de Datos.');
                      }
                      this.dbQuery.respuesta = {};
                    });
                } else if (result.isDenied) {
                  this.msg.toastMsg('Formulario no guardado.', 'info');
                }
              }
            });
          } else {
            this.msg.toastMsg('No puede crear un nuevo formulario mientras su usuario tenga un formulario activo!', 'error');
          }
        }).catch(e => {
          this.msg.msgError(e);
        });
    } else {
      this.msg.msgError(formValid.mensaje);
    }
  }



  async liquidarFormulario() {
    let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_formulario}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
    this.dbQuery.consultaAll('db', sql, 'N').then(res => {
      let sql2 = `SELECT count(*) as cnt FROM rk_hc_form_det WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and formulario_id = ${res[0].id} and estado = ?`;
      this.dbQuery.consultaAll('db', sql2, 'A').then(result => {
        console.log(result);
        if(result[0].cnt > 0){
          let data = [
            'S',
            localStorage.getItem('id_usuario'),
            this.MyUser.dateNow()
          ];
          this.dbQuery.db.executeSql(`UPDATE rk_hc_form_cab SET liquidado = ?,usuario_mod_id=?,fecha_mod=? WHERE id = ${res[0].id}`, data).then(() => {
            this.msg.toastMsg('Liquidado con exito', 'success');
            this.router.navigate(['/inicio']);
          }).catch(err => {
            this.msg.toastMsg(err, 'error');
          })
        }else{
          this.msg.toastMsg('No, puede liquidar un formulario sin detalles.', 'warning');
        }
      });
    });
  }
}
