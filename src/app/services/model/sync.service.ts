import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { catchError, map, tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class Sync {
  public storage: SQLiteObject;

  constructor(private platform: Platform, private sqlite: SQLite, private httpClient: HttpClient, private sqlPorter: SQLitePorter) {

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


 async  syncData(db) {
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

        ///// consulta rk_hc_lote_det
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

      })
  }
}
