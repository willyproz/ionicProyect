import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MsgTemplateService } from '../../../services/utilitarios/msg-template.service';
import { DbQuery } from '../../../services/model/dbQuerys.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-inicio',
  templateUrl: './form-inicio.component.html',
  styleUrls: ['./form-inicio.component.scss'],
})

export class FormInicioComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    private dbQuery: DbQuery,
    private msg: MsgTemplateService,
    private router: Router
  ) {
    this.SelectUsuario = [
      {
        codigo: localStorage.getItem('id_usuario'),
        descripcion: localStorage.getItem('nombre'),
      }
    ]

    this.dbQuery.validarLogin().subscribe(console.log);
  }
  
  
  ionViewWillEnter() {
    this.dbQuery.validarLogin().subscribe(console.log);
  }

  SelectHacienda: any[] = [];
  SelectUsuario: any[] = [];
  SelectLote: any[] = [];
  SelectModulo: any[] = [];
  SelectTipoMuestra: any[] = [];

  ngOnInit() {

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
          let data = [this.Formulario.value.hacienda_id,
          this.Formulario.value.lote_id,
          this.Formulario.value.modulo_id,
          this.Formulario.value.tipo_muestra_id];

          this.dbQuery.openOrCreateDB().then(db => {
            this.dbQuery.insertar(db, 'INSERT INTO rk_hc_form_cab (hacienda_id,lote,modulo,tipo_muestra_id) VALUES (?,?,?,?)', data)
              .then(() => {
                if (this.dbQuery.respuesta.estado === 'ok') {
                  this.Formulario.reset({
                    responsable_id:localStorage.getItem('id_usuario')
                  });
                  this.msg.msgOk();
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






    /*this.db.insertarNuevoFormulario(
      this.mainForm.value.hacienda_id,
      this.mainForm.value.lote,
      this.mainForm.value.modulo,
      this.mainForm.value.tipo_muestra_id
      ).then((res) => {
        this.mainForm.reset();
        if(this.db.respuesta.estado === 'ok'){
          this.msg.msgOk();
        }else{
          this.msg.msgError('No se pudo agregar formulario a la Base de Datos.');
        }
        this.db.respuesta = {};
      });*/
  }
}
