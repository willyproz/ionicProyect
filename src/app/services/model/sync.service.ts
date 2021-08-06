import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MsgTemplateService } from '../utilitarios/msg-template.service';
import { DbQuery } from './dbQuerys.service';
import { MyUserService } from '../utilitarios/myUser.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})

export class Sync {
  public storage: SQLiteObject;
  public respuestaSync: any = '';
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  db: any;
  constructor(
    private platform: Platform,
    private sqlPorter: SQLitePorter,
    private dbQuery: DbQuery,
    private sqlite: SQLite,
    private msgService: MsgTemplateService,
    private httpClient: HttpClient,
    private MyUser: MyUserService,
    private router: Router,
    private uniqueDeviceID: UniqueDeviceID,
    private uid: Uid,
    private androidPermissions: AndroidPermissions
  ) {
    //this.getPermission();
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.db = db;
          this.getFakeData();
        }).catch(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
    });
  }
  //ruta principal para sincronizar de 2 vias: dispositivo al server y server al dispositivo
  urlPost = 'http://app.durexporta.com/procesos/syncHacienda';

  dbState() { return this.isDbReady.asObservable(); }
  UniqueDeviceID: any;
  getUniqueDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log(uuid);
        this.UniqueDeviceID = uuid;
      })
      .catch((error: any) => {
        console.log(error);
        this.UniqueDeviceID = "Error! ${error}";
      });
  }

  getPermission() {
    this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    ).then(res => {
      if (res.hasPermission) {

      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
          alert("Persmission Granted Please Restart App!");
        }).catch(error => {
          alert("Error! " + error);
        });
      }
    }).catch(error => {
      alert("Error! " + error);
    });
  }

  getID_UID(type) {
    if (type == "IMEI") {
      return this.uid.IMEI;
    } else if (type == "ICCID") {
      return this.uid.ICCID;
    } else if (type == "IMSI") {
      return this.uid.IMSI;
    } else if (type == "MAC") {
      return this.uid.MAC;
    } else if (type == "UUID") {
      return this.uid.UUID;
    }
  }

  // Render fake data
  getFakeData() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.db, data)
        .then(_ => {
          console.log('TablasCreadas');
          //  this.openOrCreateDB();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  openOrCreateDB() {
    this.sqlite.create({
      name: 'positronx_db.db',
      location: 'default'
    })?.then((db: SQLiteObject) => {
      this.db = db;
    }).catch((e) => {
      localStorage.clear();
      this.router.navigate(['/login']);
    })
  }


  /* Sincronizar datos con el movil*/
  async syncData() {
    const options = {
      headers:
        new HttpHeaders(
          {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        )
    };
    await this.httpClient.post(`${this.urlPost}?accion=obtenerTablasSyncMovil`, {
      headers:
        new HttpHeaders(
          {
            'origin': 'http://localhost:8000',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
          }
        )
    }, options)
      .toPromise().then(
        async (res) => {
          let resultado = 'ok';
          let mensaje = 'Datos sincronizados con exito';

          let resultadoProcesoSyncHacienda = await this.procesoSyncHacienda(this.db, res);
          if (resultadoProcesoSyncHacienda.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncHacienda.mensaje;
          }

          let resultadoProcesoSyncUsuario = await this.procesoSyncUsuario(this.db, res);
          if (resultadoProcesoSyncUsuario.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncUsuario.mensaje;
          }

          let resultadoProcesoSyncLote = await this.procesoSyncLote(this.db, res);
          if (resultadoProcesoSyncLote.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncLote.mensaje;
          }

          let resultadoProcesoSyncLoteDet = await this.procesoSyncLoteDet(this.db, res);
          if (resultadoProcesoSyncLoteDet.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncLoteDet.mensaje;
          }

          let resultadoProcesoSyncFomularioCab = await this.procesoSyncFomularioCab(this.db, res);
          if (resultadoProcesoSyncFomularioCab.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncFomularioCab.mensaje;
          }

          let resultadoProcesoSyncFomularioDet = await this.procesoSyncFomularioDet(this.db, res);
          if (resultadoProcesoSyncFomularioDet.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncFomularioDet.mensaje;
          }

          let resultadoProcesoSyncTipoMuestra = await this.procesoSyncTipoMuestra(this.db, res);
          if (resultadoProcesoSyncTipoMuestra.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncTipoMuestra.mensaje;
          }

          let resultadoProcesoSyncFormulario = await this.procesoSyncFormulario(this.db, res);
          if (resultadoProcesoSyncFormulario.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncFormulario.mensaje;
          }

          let resultadoprocesoSyncPersonaFormularioHacienda = await this.procesoSyncPersonaFormularioHacienda(this.db, res);
          if (resultadoprocesoSyncPersonaFormularioHacienda.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoprocesoSyncPersonaFormularioHacienda.mensaje;
          }

          if (resultado === 'ok') {
            this.msgService.msgInfo('Datos sincronizados con exito');
          } else {
            this.msgService.msgError(mensaje);
          }

        }).catch((err) => {
          this.msgService.msgError(err.message);
        });
  }

  async procesoSyncHacienda(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_hacienda';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_hacienda'];
    let p = l.map((l) => `(${l.id},'${l.sigla}','${l.nombre}','${l.estado}')`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_hacienda (id,sigla,nombre,estado) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }


  async procesoSyncUsuario(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_usuario';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_usuario'];
    let p = l.map((l) => `(${l.id},'${l.cedula}','${l.clave}','${l.correo}','${l.estado}',${l.exportador_id},'${l.fecha_cre}','${l.fecha_mod}','${l.nombre}','${l.ultimo_ingreso}',${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_usuario (id,cedula,clave,correo,estado,exportador_id,fecha_cre,fecha_mod,nombre,ultimo_ingreso,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncLote(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_lote';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_lote'];
    let p = l.map((l) => `('${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.hacienda_id},${l.id},'${l.lote}',${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_lote (estado,fecha_cre,fecha_mod,hacienda_id,id,lote,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncLoteDet(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_lote_det';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_lote_det'];
    let p = l.map((l) => `('${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.id},${l.lote_id},'${l.modulo}',${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_lote_det (estado,fecha_cre,fecha_mod,id,lote_id,modulo,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncFomularioCab(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_tipo_formulario_cab';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_tipo_formulario_cab'];
    let p = l.map((l) => `('${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.id},'${l.nombre_formulario}','${l.sigla}',${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_tipo_formulario_cab (estado,fecha_cre,fecha_mod,id,nombre_formulario,sigla,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncFomularioDet(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_tipo_formulario_det';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_tipo_formulario_det'];
    let p = l.map((l) => `('${l.cuadrante}','${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.id},${l.max_linea},${l.n_cuadrante},${l.n_rama},'${l.nombre}',${l.nota_max},${l.nota_min},'${l.rama}','${l.tipo}',${l.tipo_formulario_cab_id},${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_tipo_formulario_det (cuadrante,estado,fecha_cre,fecha_mod,id,max_linea,n_cuadrante,n_rama,nombre,nota_max,nota_min,rama,tipo,tipo_formulario_cab_id,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncTipoMuestra(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_tipo_muestra';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_tipo_muestra'];
    let p = l.map((l) => `('${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.id},'${l.nombre}',${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_tipo_muestra (estado,fecha_cre,fecha_mod,id,nombre,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncFormulario(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_formulario';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_formulario'];
    let p = l.map((l) => `('${l.sigla}','${l.ruta}','${l.icono}','${l.color}','${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.id},'${l.nombre}',${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_formulario (sigla,ruta,icono,color,estado,fecha_cre,fecha_mod,id,nombre,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  async procesoSyncPersonaFormularioHacienda(db, res) {
    let resultado;
    let deleteHc = 'DELETE FROM rk_hc_persona_formulario_hacienda';
    db.executeSql(deleteHc, []);
    let l = res['rk_hc_persona_formulario_hacienda'];
    let p = l.map((l) => `(${l.usuario_id},${l.formulario_id},${l.hacienda_id},'${l.estado}','${l.fecha_cre}','${l.fecha_mod}',${l.id},${l.usuario_cre_id},${l.usuario_mod_id})`).join(',');
    await db.executeSql(`INSERT INTO rk_hc_persona_formulario_hacienda (usuario_id,formulario_id,hacienda_id,estado,fecha_cre,fecha_mod,id,usuario_cre_id,usuario_mod_id) VALUES ${p};`, {})
      .then((resul) => {
        resultado = { estado: 'ok', mensaje: resul.rowsAffected }
      }
      ).catch((err) => { resultado = { estado: 'error', mensaje: err } });
    return resultado;
  }

  /*procesoSync(db, tabla, key, valor) {
    let deleteTable = 'DELETE FROM ' + tabla;
    db.executeSql(deleteTable, []).then(() => {
      db.executeSql(`INSERT INTO ${tabla} ${key} VALUES ${valor};`, {}).then(
        console.log
      );
    }).catch((err) => { return err });
  }*/

  /* Sincronizar datos con el server*/

  conteoLoadingEnd: number = 0;
 async syncDataServer(db) {
    let loading = await this.msgService.loadingCreate('Sincronizando datos por favor espere...1');
    var Formulario: any = {};
    this.dbQuery.consultaAll('db', `SELECT * FROM rk_hc_form_cab WHERE liquidado ='S' and sincronizado = ?`, 'N')
      .then(async dataCab => {
        // console.log('dataCab');
         console.log(dataCab);

        this.msgService.loading(true, loading);
        Object.entries(dataCab).forEach(async ([key, element]: any) => {
          // console.log(key);
          Formulario['f' + key] = {};
          // await this.postDataServer(element); 256
          await this.dbQuery.consultaAll('db', `SELECT * FROM rk_hc_form_det WHERE formulario_id = ${element.id} and sincronizado = ?`, 'N')
            .then(dataDet => {
              Formulario['f' + key]['rk_hc_form_det'] = dataDet;
            });
          await this.dbQuery.consultaAll('db', `SELECT * FROM rk_hc_form_files WHERE formulario_id = ${element.id} and sincronizado = ?`, 'N')
            .then(dataFiles => {
              Formulario['f' + key]['rk_hc_form_files'] = dataFiles;
            });
          Formulario['f' + key]['rk_hc_form_cab'] = element;
          Formulario['f' + key]['identificador'] = this.getID_UID('UUID');
          await this.postDataServer(Formulario['f' + key], this.db, loading);
          //console.log('Formulario');
          //console.log(Formulario['f' + key]);
          //console.log(element);
        });
        console.log(this.getID_UID('UUID'));
        var timerInterval = setInterval(() => {
          /*console.log(this.conteo);
          console.log(dataCab.length);*/
          if ((dataCab.length > 0) && (this.conteoLoadingEnd === dataCab.length)) {
            console.log('entre');
            this.msgService.loading(false, loading);
            this.msgService.msgInfo('Datos enviados con exito');
            this.conteoLoadingEnd = 0;
            clearInterval(timerInterval);
          }
        }, 100);

        if (dataCab.length < 1) {
          this.msgService.loading(false, loading);
          this.msgService.msgInfo('No tiene datos para sincronizar.');
        }

      });
  }

  async postDataServer(datos, db, loading) {

    const options = {
      headers:
        new HttpHeaders(
          {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        )
    };
    return await this.httpClient.post(`${this.urlPost}?accion=guardarDatosServer`, JSON.stringify(datos), options)
      .toPromise().then(
        (res: any) => {
          // console.log(res);
         // let mensaje = 'Datos enviados con exito';

          if (res.estado === 'ok') {
            let data = [
              'S',
              localStorage.getItem('id_usuario'),
              this.MyUser.dateNow()
            ];
            db.executeSql(`UPDATE rk_hc_form_cab SET sincronizado = ?,usuario_mod_id=?,fecha_mod=? WHERE id = ${res.mensaje}`, data).catch((res) => {
              this.msgService.msgError(res);
            });
            db.executeSql(`UPDATE rk_hc_form_det SET sincronizado = ?,usuario_mod_id=?,fecha_mod=? WHERE formulario_id = ${res.mensaje}`, data).catch((res) => {
              this.msgService.msgError(res);
            });
            db.executeSql(`UPDATE rk_hc_form_files SET sincronizado = ?,usuario_mod_id=?,fecha_mod=? WHERE formulario_id = ${res.mensaje}`, data).catch((res) => {
              this.msgService.msgError(res);
            });

            this.conteoLoadingEnd++;

          } else {
            this.msgService.loading(false, loading);
            this.msgService.msgError('Error al enviar datos, favor intentar más tarde.');
            return;
          }
        }).catch((err) => {
        //  console.log(err);
          this.msgService.loading(false, loading);
          this.msgService.msgError('Ha ocurrido un error en el servidor por favor intente más tarde. status:' + err.status + '; msg:' + err.statusText);
        });

  }

}
