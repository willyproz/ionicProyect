import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MsgTemplateService } from '../../../services/utilitarios/msg-template.service';
import { DbQuery } from '../../../services/model/dbQuerys.service';
import { MyUserService } from '../../../services/utilitarios/myUser.service';

@Component({
  selector: 'app-form-inicio',
  templateUrl: './form-inicio.component.html',
  styleUrls: ['./form-inicio.component.scss'],
})

export class FormInicioComponent implements OnInit {

  @Input() tituloTabla: string = '';
  constructor(
    public formBuilder: FormBuilder,
    private dbQuery: DbQuery,
    private msg: MsgTemplateService,
    private MyUser: MyUserService
  ) {
    this.SelectUsuario = [
      {
        codigo: localStorage.getItem('id_usuario'),
        descripcion: localStorage.getItem('nombre'),
      }
    ]
  }


  ionViewWillEnter() {
  }

  SelectHacienda: any[] = [];
  SelectUsuario: any[] = [];
  SelectLote: any[] = [];
  SelectModulo: any[] = [];
  SelectTipoMuestra: any[] = [];
  TablaFormularioCab: any[] = [];

  ngOnInit() {

    this.Formulario = this.formBuilder.group({
      responsable_id: [''],
      hacienda_id: [''],
      lote_id: [''],
      modulo_id: [''],
      tipo_muestra_id: ['']
    });

    this.consultarTabla();

    this.dbQuery.openOrCreateDB().then(db => {
      this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion  FROM rk_hc_hacienda  WHERE estado = ?', 'A')
        .then(item => {
          this.SelectHacienda = item;
        });


      /*this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion FROM rk_hc_usuario WHERE estado = ?', 'A')
            .then(item => {
              this.SelectUsuario = item;
            });*/


      this.dbQuery.consultaAll(db, 'SELECT id as codigo, lote as descripcion FROM rk_hc_lote WHERE estado = ?', 'A')
        .then(item => {
          this.SelectLote = item;
        });


      this.dbQuery.consultaAll(db, 'SELECT id as codigo, modulo as descripcion  FROM rk_hc_lote_det WHERE estado = ?', 'A')
        .then(item => {
          this.SelectModulo = item;
        });

      this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion FROM rk_hc_tipo_muestra WHERE estado = ?', 'A')
        .then(item => {
          this.SelectTipoMuestra = item;
        });

    })
  }

  consultarTabla() {
    this.dbQuery.openOrCreateDB().then(db => {
      let sql = 'SELECT ca.id, rhh.nombre as hacienda, ca.lote,ca.modulo, tm.nombre as tipo_muestra , ca.estado,rhu.nombre as usuario_cre, ca.fecha_cre, ca.liquidado FROM rk_hc_form_cab ca LEFT JOIN rk_hc_hacienda rhh on rhh.id = ca.hacienda_id LEFT JOIN rk_hc_tipo_muestra tm on tm.id = ca.tipo_muestra_id LEFT JOIN rk_hc_usuario rhu on rhu.id = ca.usuario_cre_id WHERE ca.estado = ?';
      this.dbQuery.consultaAll(db, sql, 'A')
        .then(item => {
          this.TablaFormularioCab = item;
        });
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
    console.log(this.Formulario.value);
    console.log(this.Formulario.valid);
    this.msg.msgConfirmar().then((result) => {

      if (result.isConfirmed) {
        if (this.Formulario.valid === true) {
          let data = [
            this.Formulario.value.hacienda_id,
            this.Formulario.value.lote_id,
            this.Formulario.value.modulo_id,
            this.Formulario.value.tipo_muestra_id,
            localStorage.getItem('id_usuario'),
            this.MyUser.dateNow()
          ];

          this.dbQuery.openOrCreateDB().then(db => {
            this.dbQuery.insertar(db, 'INSERT INTO rk_hc_form_cab (hacienda_id,lote,modulo,tipo_muestra_id,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?)', data)
              .then(() => {
                if (this.dbQuery.respuesta.estado === 'ok') {
                  this.Formulario.reset({
                    responsable_id: localStorage.getItem('id_usuario')
                  });
                  this.msg.msgOk();
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
        this.msg.msgInfo('Formulario no guardado');
      }
    });

  }
}
