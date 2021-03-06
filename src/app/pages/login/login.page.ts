import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/model/db.service';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { Sync } from 'src/app/services/model/sync.service';
import { MsgTemplateService } from 'src/app/services/utilitarios/msg-template.service';
import { Md5 } from 'ts-md5/dist/md5';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private msg: MsgTemplateService,
    private Dbservices: DbService,
    private dbquery: DbQuery,
    private db: Sync
  ) {
    //this.syncronize();
  }

  ngOnInit() {
    this.syncronize();
   }

  ionViewWillEnter() {
  //  this.syncronize();
    this.Formulario.reset();
  }

  Formulario: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async login() {
    var { email, password } = this.Formulario.value;
    let correoHost = email.indexOf('@');
    if (this.Formulario.valid === true) {
      if (correoHost === -1) {
        email = email + '@durexporta.com';
      }
      let clave = Md5.hashStr(password);
      let sql = 'SELECT COUNT(*) as cnt, nombre,id FROM rk_hc_usuario WHERE correo = "' + email + '"  and clave = "' + clave + '"'
        this.dbquery.consultaLogin('db', sql)
          .then(async (res) => {
            if (res[0].cnt === 1) {
              let emailCodec = Md5.hashStr(email);
              let token = emailCodec + clave;
              await localStorage.setItem('token', token);
              await localStorage.setItem('user', email);
              await localStorage.setItem('nombre', res[0].nombre);
              await localStorage.setItem('id_usuario', res[0].id);
              this.router.navigate(['/inicio'])
              this.msg.msgOk('Inicio de sesi??n exitoso.');
            } else {
              this.msg.msgError('Usuario o Contrase??a incorrectos.');
            }
          }).catch(e => {
            localStorage.clear();
            this.router.navigate(['/login'])
          });
    } else {
      this.msg.msgError('Debe completar los campos del login.');
    }
  }





  //  this.syncronize();
  // data = new BehaviorSubject([]);

  async syncronize() {
    let loading = await this.msg.loadingCreate('Sincronizando datos por favor espere...');
    this.msg.loading(true, loading)
      this.db.syncData().then(() => {
        this.msg.loading(false, loading);
      }).catch(()=>{
        this.msg.msgError('Por favor intente sincronizar m??s tarde.');
      });

  }


}

