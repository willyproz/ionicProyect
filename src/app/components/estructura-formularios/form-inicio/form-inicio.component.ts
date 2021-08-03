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

  ngOnInit() {
    this.consultarTabla();
    this.Formulario = this.formBuilder.group({
      responsable_id: [''],
      hacienda_id: [''],
      lote_id: [''],
      modulo_id: [''],
      tipo_muestra_id: ['']
    });



    this.dbQuery.openOrCreateDB().then(db => {
      this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion  FROM rk_hc_hacienda  WHERE estado = ?', 'A')
        .then(item => {
          this.SelectHacienda = item;
        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });


      /*this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion FROM rk_hc_usuario WHERE estado = ?', 'A')
            .then(item => {
              this.SelectUsuario = item;
            });*/


      this.dbQuery.consultaAll(db, 'SELECT id as codigo, lote as descripcion FROM rk_hc_lote WHERE estado = ?', 'A')
        .then(item => {
          this.SelectLote = item;
        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });;


      this.dbQuery.consultaAll(db, 'SELECT id as codigo, modulo as descripcion  FROM rk_hc_lote_det WHERE estado = ?', 'A')
        .then(item => {
          this.SelectModulo = item;
        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });;

      this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion FROM rk_hc_tipo_muestra WHERE estado = ?', 'A')
        .then(item => {
          this.SelectTipoMuestra = item;
        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });;

    })
  }

  consultarTabla() {
    this.dbQuery.openOrCreateDB().then(db => {
      let sql = `SELECT * FROM rk_hc_form_cab WHERE tipo_form = '${this.tipo_formulario}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and liquidado = ?`;
      this.dbQuery.consultaAll(db, sql, 'N')
        .then(item => {
          this.FormularioCab = item;
        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });
    });

    this.dbQuery.openOrCreateDB().then(db => {
      let sql = `SELECT ca.tipo_form, ca.id, rhh.nombre as hacienda, ca.lote,ca.modulo, tm.nombre as tipo_muestra , ca.estado,rhu.nombre as usuario_cre, ca.fecha_cre, ca.liquidado FROM rk_hc_form_cab ca LEFT JOIN rk_hc_hacienda rhh on rhh.id = ca.hacienda_id LEFT JOIN rk_hc_tipo_muestra tm on tm.id = ca.tipo_muestra_id LEFT JOIN rk_hc_usuario rhu on rhu.id = ca.usuario_cre_id WHERE ca.tipo_form = '${this.tipo_formulario}' and ca.liquidado = ?`;
      this.dbQuery.consultaAll(db, sql, 'N')
        .then(item => {
          this.TablaFormularioCab = item;
        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });;
    });
  }

  Formulario: FormGroup = this.formBuilder.group({
    hacienda_id: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]')]],
    lote_id: ['', [Validators.required, Validators.minLength(6)], Validators.pattern('[0-9]')],
    modulo_id: ['', [Validators.required, Validators.minLength(6)], Validators.pattern('[0-9]')],
    responsable_id: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]')]],
    tipo_muestra_id: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]')]]
  });


  insertarFormulario() {

    this.dbQuery.openOrCreateDB().then(db => {
      let sql = `SELECT count(*) as cnt FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_formulario}' and liquidado = ? `;
      this.dbQuery.consultaAll(db, sql, 'N')
        .then(resp => {
          console.log(resp);
          if (resp[0].cnt < 1) {

            this.msg.msgConfirmar().then((result) => {
              if (result.isConfirmed) {
                if (this.Formulario.valid === true) {
                  let data = [
                    this.tipo_formulario,
                    this.Formulario.value.hacienda_id,
                    this.Formulario.value.lote_id,
                    this.Formulario.value.modulo_id,
                    this.Formulario.value.tipo_muestra_id,
                    localStorage.getItem('id_usuario'),
                    this.MyUser.dateNow()
                  ];
                  this.dbQuery.openOrCreateDB().then(db => {
                    this.dbQuery.insertar(db, 'INSERT INTO rk_hc_form_cab (tipo_form,hacienda_id,lote,modulo,tipo_muestra_id,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?)', data)
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
                  });
                } else {
                  this.msg.msgError('Favor verificar que los campos del formulario no esten vacios');
                }
              } else if (result.isDenied) {
                //  this.msg.msgInfo('Formulario no guardado');
                this.msg.toastMsg('Formulario no guardado.', 'info');
              }
            });
          } else {
            this.msg.toastMsg('No puede crear un nuevo formulario mientras su usuario tenga un formulario activo!', 'error');
          }

        }).catch(e => {
          localStorage.clear();
          this.router.navigate(['/login'])
        });
    });
  }



  async liquidarFormulario() {
    await this.dbQuery.openOrCreateDB().then(db => {
      let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_formulario}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
      this.dbQuery.consultaAll(db, sql, 'N').then(result => {
        let data = [
          'S',
          localStorage.getItem('id_usuario'),
          this.MyUser.dateNow()
        ];
        db.executeSql(`UPDATE rk_hc_form_cab SET liquidado = ?,usuario_mod_id=?,fecha_mod=? WHERE id = ${result[0].id}`, data).then(() => {
          this.msg.toastMsg('Liquidado con exito', 'success');
          this.router.navigate(['/inicio']);
        }).catch(err => {
          this.msg.toastMsg(err, 'error');
          localStorage.clear();
          this.router.navigate(['/login'])
        })
      });
    });
  }
}
