import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { MsgTemplateService } from '../../../services/utilitarios/msg-template.service';
import { DbQuery } from '../../../services/model/dbQuerys.service';

@Component({
  selector: 'app-form-inicio',
  templateUrl: './form-inicio.component.html',
  styleUrls: ['./form-inicio.component.scss'],
})

export class FormInicioComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    private dbQuery: DbQuery,
    private msg: MsgTemplateService
  ) {
    
   }

  SelectHacienda: any[] = [];
  SelectUsuario: any[] = [];
  SelectLote: any[] = [];
  SelectModulo: any[] = [];
  SelectTipoMuestra: any[] = [];

  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      responsable: [''],
      hacienda_id: [''],
      lote: [''],
      modulo: [''],
      tipo_muestra_id: ['']
    });


    this.dbQuery.openOrCreateDB().then(db => {
      this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion  FROM rk_hc_hacienda  WHERE estado = ?', 'A')
        .then(item => {
          this.SelectHacienda = item;
        });


      this.dbQuery.consultaAll(db, 'SELECT id as codigo, nombre as descripcion FROM rk_hc_usuario WHERE estado = ?', 'A')
        .then(item => {
          this.SelectUsuario = item;
        });


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
  mainForm: FormGroup;



  insertarFormulario() {
    //console.log(this.mainForm.value);
    /* this.db.insertarNuevoFormulario(
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
