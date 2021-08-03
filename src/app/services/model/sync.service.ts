import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MsgTemplateService } from '../utilitarios/msg-template.service';
import { DbQuery } from './dbQuerys.service';
import { MyUserService } from '../utilitarios/myUser.service';


@Injectable({
  providedIn: 'root'
})

export class Sync {
  public storage: SQLiteObject;
  public respuestaSync: any = '';
  constructor(private platform: Platform,
    private dbQuery: DbQuery,
    private sqlite: SQLite,
    private msgService: MsgTemplateService,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private MyUser: MyUserService) {

  }
  //ruta principal para sincronizar de 2 vias: dispositivo al server y server al dispositivo
  urlPost = 'http://200.0.73.169:189/procesos/syncHacienda';

  openOrCreateDB() {
    return this.sqlite.create({
      name: 'positronx_db.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db;
      })
    //.catch(e => console.log(e));
  }


  /* Sincronizar datos con el movil*/
  async syncData(db) {
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

          let resultadoProcesoSyncHacienda = await this.procesoSyncHacienda(db, res);
          if (resultadoProcesoSyncHacienda.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncHacienda.mensaje;
          }

          let resultadoProcesoSyncUsuario = await this.procesoSyncUsuario(db, res);
          if (resultadoProcesoSyncUsuario.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncUsuario.mensaje;
          }

          let resultadoProcesoSyncLote = await this.procesoSyncLote(db, res);
          if (resultadoProcesoSyncLote.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncLote.mensaje;
          }

          let resultadoProcesoSyncLoteDet = await this.procesoSyncLoteDet(db, res);
          if (resultadoProcesoSyncLoteDet.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncLoteDet.mensaje;
          }

          let resultadoProcesoSyncFomularioCab = await this.procesoSyncFomularioCab(db, res);
          if (resultadoProcesoSyncFomularioCab.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncFomularioCab.mensaje;
          }

          let resultadoProcesoSyncFomularioDet = await this.procesoSyncFomularioDet(db, res);
          if (resultadoProcesoSyncFomularioDet.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncFomularioDet.mensaje;
          }

          let resultadoProcesoSyncTipoMuestra = await this.procesoSyncTipoMuestra(db, res);
          if (resultadoProcesoSyncTipoMuestra.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncTipoMuestra.mensaje;
          }

          let resultadoProcesoSyncFormulario = await this.procesoSyncFormulario(db, res);
          if (resultadoProcesoSyncFormulario.estado === 'error') {
            resultado = 'error';
            mensaje = resultadoProcesoSyncFormulario.mensaje;
          }

          let resultadoprocesoSyncPersonaFormularioHacienda = await this.procesoSyncPersonaFormularioHacienda(db, res);
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
          this.msgService.msgError(err);
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
    console.log(res);
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
  syncDataServer(db) {
    var Formulario: any = {}
    this.dbQuery.consultaAll(db, `SELECT * FROM rk_hc_form_cab WHERE liquidado ='S' and sincronizado = ?`, 'N')
      .then(async dataCab => {
        let loading = await this.msgService.loadingCreate('Sincronizando datos por favor espere...');
        this.msgService.loading(true, loading);
        await Object.entries(dataCab).forEach(async ([key, element]: any) => {
          Formulario['rk_hc_form_cab'] = element;
          // await this.postDataServer(element);
          await this.dbQuery.consultaAll(db, `SELECT * FROM rk_hc_form_det WHERE formulario_id = ${element.id} and sincronizado = ?`, 'N')
            .then(dataDet => {
              Formulario['rk_hc_form_det'] = dataDet;
            });
          await this.dbQuery.consultaAll(db, `SELECT * FROM rk_hc_form_files WHERE formulario_id = ${element.id} and sincronizado = ?`, 'N')
            .then(dataFiles => {
              Formulario['rk_hc_form_files'] = dataFiles;
            });
          await this.postDataServer(Formulario, db,loading);

        });

        var timerInterval = setInterval(() => {
          /*console.log(this.conteo);
          console.log(dataCab.length);*/
          if (this.conteoLoadingEnd === dataCab.length) {
            this.msgService.loading(false, loading);
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

  async postDataServer(datos, db,loading) {

    const options = {
      headers:
        new HttpHeaders(
          {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        )
    };
    this.httpClient.post(`${this.urlPost}?accion=guardarDatosServer`, JSON.stringify(datos), options)
      .toPromise().then(
        (res: any) => {
          console.log(res);
          let mensaje = 'Datos enviados con exito';

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
            this.msgService.msgInfo(mensaje);
          } else {

            this.msgService.msgError(mensaje);
          }
        }).catch((err) => {
          console.log(err);
          this.msgService.loading(false, loading);
          this.msgService.msgError('Ha ocurrido un error en el servidor por favor intente más tarde. status:'+err.status+'; msg:'+err.statusText);
        });

  }

}
