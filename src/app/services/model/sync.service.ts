import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MsgTemplateService } from '../utilitarios/msg-template.service';


@Injectable({
  providedIn: 'root'
})

export class Sync {
  public storage: SQLiteObject;
  public respuestaSync: any = '';
  constructor(private platform: Platform, private sqlite: SQLite, private msgService: MsgTemplateService, private httpClient: HttpClient, private sqlPorter: SQLitePorter) {

  }

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


  /*async  syncData(db) {
       await this.httpClient.post('http://200.0.73.169:189/procesos/syncHacienda', {}).toPromise()
       .then( function (res) {
         console.log(res);

         ///// consulta rk_hc_hacienda

         let cntRkHcHacienda = res['rk_hc_hacienda'].length;
         let rkHcFormCab = 'INSERT INTO rk_hc_hacienda (id,sigla,nombre,estado) VALUES (?,?,?,?)';
         let i: number = 0;
         for (i = 0; i < cntRkHcHacienda; i++) {
           let data = [res['rk_hc_hacienda'][i].id, res['rk_hc_hacienda'][i].sigla, res['rk_hc_hacienda'][i].nombre, res['rk_hc_hacienda'][i].estado];
           db.executeSql(rkHcFormCab, data)
             .catch(err => {
               return err;
             });
         }

         ///// consulta rk_hc_usuario
         i = 0;
         let cntRkHcUsuario = res['rk_hc_usuario'].length;
         let rkHcUsuario = 'INSERT INTO rk_hc_usuario (id,cedula,clave,correo,estado,exportador_id,fecha_cre,fecha_mod,nombre,ultimo_ingreso,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

         for (i = 0; i < cntRkHcUsuario; i++) {
           let data = [res['rk_hc_usuario'][i].id, res['rk_hc_usuario'][i].cedula, res['rk_hc_usuario'][i].clave, res['rk_hc_usuario'][i].correo,
           res['rk_hc_usuario'][i].estado, res['rk_hc_usuario'][i].exportador_id, res['rk_hc_usuario'][i].fecha_cre,
           res['rk_hc_usuario'][i].fecha_mod, res['rk_hc_usuario'][i].nombre, res['rk_hc_usuario'][i].ultimo_ingreso,
           res['rk_hc_usuario'][i].usuario_cre_id, res['rk_hc_usuario'][i].usuario_mod_id];
           db.executeSql(rkHcUsuario, data)
             .catch(err => {
               return err;
             });
         }

         ///// consulta rk_hc_lote
         i = 0;
         let cntRkHcLote = res['rk_hc_lote'].length;
         let rkHcLote = 'INSERT INTO rk_hc_lote (estado,fecha_cre,fecha_mod,hacienda_id,id,lote,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?,?)';

         for (i = 0; i < cntRkHcLote; i++) {
           let data = [
             res['rk_hc_lote'][i].estado, res['rk_hc_lote'][i].fecha_cre, res['rk_hc_lote'][i].fecha_mod, res['rk_hc_lote'][i].hacienda_id,
             res['rk_hc_lote'][i].id, res['rk_hc_lote'][i].lote, res['rk_hc_lote'][i].usuario_cre_id,
             res['rk_hc_lote'][i].usuario_mod_id
           ];
           db.executeSql(rkHcLote, data)
             .catch(err => {
               return err;
             });
         }

         ///// consulta rk_hc_lote_det
         i = 0;
         let cntRkHcLoteDet = res['rk_hc_lote_det'].length;
         let rkHcLoteDet = 'INSERT INTO rk_hc_lote_det (estado,fecha_cre,fecha_mod,id,lote_id,modulo,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?,?)';

         for (i = 0; i < cntRkHcLoteDet; i++) {
           let data = [
             res['rk_hc_lote_det'][i].estado, res['rk_hc_lote_det'][i].fecha_cre, res['rk_hc_lote_det'][i].fecha_mod, res['rk_hc_lote_det'][i].id,
             res['rk_hc_lote_det'][i].lote_id, res['rk_hc_lote_det'][i].modulo, res['rk_hc_lote_det'][i].usuario_cre_id,
             res['rk_hc_lote_det'][i].usuario_mod_id
           ];
           db.executeSql(rkHcLoteDet, data)
             .catch(err => {
               return err;
             });
         }

         ///// consulta rk_hc_tipo_formulario_cab
         i = 0;
         let cntRkHcTipoFormularioCab = res['rk_hc_tipo_formulario_cab'].length;
         let rkHcTipoFormularioCab = 'INSERT INTO rk_hc_tipo_formulario_cab (estado,fecha_cre,fecha_mod,id,nombre_formulario,sigla,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?,?)';
         let rkHcTipoFormularioCabDelete = 'DELETE FROM rk_hc_tipo_formulario_cab';

         db.executeSql(rkHcTipoFormularioCabDelete, [])
             .then(resp => {
               console.log(resp);
             })
             .catch(err => {
               console.log(err);
               return err;
             });

         for (i = 0; i < cntRkHcTipoFormularioCab; i++) {
           let data = [
             res['rk_hc_tipo_formulario_cab'][i].estado, res['rk_hc_tipo_formulario_cab'][i].fecha_cre, res['rk_hc_tipo_formulario_cab'][i].fecha_mod, res['rk_hc_tipo_formulario_cab'][i].id,
             res['rk_hc_tipo_formulario_cab'][i].nombre_formulario, res['rk_hc_tipo_formulario_cab'][i].sigla, res['rk_hc_tipo_formulario_cab'][i].usuario_cre_id,
             res['rk_hc_tipo_formulario_cab'][i].usuario_mod_id
           ];
           db.executeSql(rkHcTipoFormularioCab, data)
             .then(resp => {
               console.log(resp);
             })
             .catch(err => {
               console.log(err);
               return err;
             });
         }

         ///// consulta rk_hc_tipo_formulario_det
         i = 0;
         let cntRkHcTipoFormularioDet = res['rk_hc_tipo_formulario_det'].length;
         let rkHcTipoFormularioDet = 'INSERT INTO rk_hc_tipo_formulario_det (cuadrante,estado,fecha_cre,fecha_mod,id,max_linea,n_cuadrante,n_rama,nombre,nota_max,nota_min,rama,tipo,tipo_formulario_cab_id,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

         for (i = 0; i < cntRkHcTipoFormularioDet; i++) {
           let data = [
             res['rk_hc_tipo_formulario_det'][i].cuadrante, res['rk_hc_tipo_formulario_det'][i].estado, res['rk_hc_tipo_formulario_det'][i].fecha_cre, res['rk_hc_tipo_formulario_det'][i].fecha_mod, res['rk_hc_tipo_formulario_det'][i].id,
             res['rk_hc_tipo_formulario_det'][i].max_linea, res['rk_hc_tipo_formulario_det'][i].n_cuadrante, res['rk_hc_tipo_formulario_det'][i].n_rama, res['rk_hc_tipo_formulario_det'][i].nombre, res['rk_hc_tipo_formulario_det'][i].nota_max, res['rk_hc_tipo_formulario_det'][i].nota_min,
             res['rk_hc_tipo_formulario_det'][i].rama, res['rk_hc_tipo_formulario_det'][i].tipo, res['rk_hc_tipo_formulario_det'][i].tipo_formulario_cab_id,
             res['rk_hc_tipo_formulario_det'][i].usuario_cre_id, res['rk_hc_tipo_formulario_det'][i].usuario_mod_id
           ];
           db.executeSql(rkHcTipoFormularioDet, data)
             .catch(err => {
               return err;
             });
         }

         ///// consulta rk_hc_tipo_muestra
         i = 0;
         let cntRkHcTipoMuestra = res['rk_hc_tipo_muestra'].length;
         let rkHcTipoMuestra = 'INSERT INTO rk_hc_tipo_muestra (estado,fecha_cre,fecha_mod,id,nombre,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?)';

         for (i = 0; i < cntRkHcTipoMuestra; i++) {
           let data = [
             res['rk_hc_tipo_muestra'][i].estado, res['rk_hc_tipo_muestra'][i].fecha_cre,
             res['rk_hc_tipo_muestra'][i].fecha_mod, res['rk_hc_tipo_muestra'][i].id,
             res['rk_hc_tipo_muestra'][i].nombre, res['rk_hc_tipo_muestra'][i].usuario_cre_id,
             res['rk_hc_tipo_muestra'][i].usuario_mod_id
           ];
           db.executeSql(rkHcTipoMuestra, data)
             .catch(err => {
               return err;
             });
         }

         /*let mensaje = {estado: 'ok',  mensaje: 'asdasd'  };
         return mensaje;*/

  /* })
}*/

  async syncData(db) {
    await this.httpClient.post('http://200.0.73.169:189/procesos/syncHacienda',{
      headers:
        new HttpHeaders(
          {
            'origin': 'http://localhost:8000',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
          }
        )
    })
      .toPromise().then(
        async (res) => {
          let resultado = 'ok';
          let mensaje = 'Datos sincronizados con exito';

          let resultadoProcesoSyncHacienda = await this.procesoSyncHacienda(db, res);
          if(resultadoProcesoSyncHacienda.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncHacienda.mensaje;
          }

          let resultadoProcesoSyncUsuario = await this.procesoSyncUsuario(db, res);
          if(resultadoProcesoSyncUsuario.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncUsuario.mensaje;
          }

          let resultadoProcesoSyncLote = await this.procesoSyncLote(db, res);
          if(resultadoProcesoSyncLote.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncLote.mensaje;
          }

          let resultadoProcesoSyncLoteDet = await this.procesoSyncLoteDet(db, res);
          if(resultadoProcesoSyncLoteDet.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncLoteDet.mensaje;
          }

          let resultadoProcesoSyncFomularioCab = await this.procesoSyncFomularioCab(db, res);
          if(resultadoProcesoSyncFomularioCab.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncFomularioCab.mensaje;
          }

          let resultadoProcesoSyncFomularioDet = await this.procesoSyncFomularioDet(db, res);
          if(resultadoProcesoSyncFomularioDet.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncFomularioDet.mensaje;
          }

          let resultadoProcesoSyncTipoMuestra = await this.procesoSyncTipoMuestra(db, res);
          if(resultadoProcesoSyncTipoMuestra.estado === 'error'){
            resultado = 'error';
            mensaje = resultadoProcesoSyncTipoMuestra.mensaje;
          }
          
          if(resultado === 'ok'){
            this.msgService.msgInfo(mensaje);
          }else{
            this.msgService.msgError(mensaje);
          }
          
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

  /*procesoSync(db, tabla, key, valor) {
    let deleteTable = 'DELETE FROM ' + tabla;
    db.executeSql(deleteTable, []).then(() => {
      db.executeSql(`INSERT INTO ${tabla} ${key} VALUES ${valor};`, {}).then(
        console.log
      );
    }).catch((err) => { return err });
  }*/
}
