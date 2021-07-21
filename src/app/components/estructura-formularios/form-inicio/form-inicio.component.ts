import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { DbService } from '../../../services/model/db.service';
import { MsgTemplateService } from 'src/app/services/utilitarios/msg-template.service';
//import { FormulariosService } from 'src/app/services/model/formularios.service';

@Component({
  selector: 'app-form-inicio',
  templateUrl: './form-inicio.component.html',
  styleUrls: ['./form-inicio.component.scss'],
})

export class FormInicioComponent implements OnInit {

  constructor(
              public formBuilder: FormBuilder,
              private db: DbService,
            //  private formulario:FormulariosService,
              private msg:MsgTemplateService
              ){}

  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      responsable: [''],
      hacienda_id: [''],
      lote: [''],
      modulo: [''],
      tipo_muestra_id:['']
    })
  }
  mainForm: FormGroup;

  insertarFormulario() {
    console.log(this.mainForm.value);
    this.db.insertarNuevoFormulario(
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
      });
    }
}
