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

  constructor(private platform: Platform,private sqlite: SQLite,private httpClient: HttpClient, private sqlPorter: SQLitePorter)
  {
    
  }

  openOrCreateDB(){
     return this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
         return db;
        })
        //.catch(e => console.log(e));
  }


  async syncData(db){
    await this.httpClient.post('http://200.0.73.169:189/procesos/syncHacienda',{}).toPromise()
    .then( res => {
      console.log(res['rk_hc_hacienda']);
      let cntRkHcHacienda = res['rk_hc_hacienda'].length;
      let rkHcFormCab = 'INSERT INTO rk_hc_hacienda (id,sigla,nombre,estado) VALUES (?,?,?,?)';
      let i:number = 0;
      for (i = 0; i < cntRkHcHacienda; i++) {
        let data = [res['rk_hc_hacienda'][i].id,res['rk_hc_hacienda'][i].sigla,res['rk_hc_hacienda'][i].nombre,res['rk_hc_hacienda'][i].estado];
        db.executeSql(rkHcFormCab, data)
        .catch(err =>{
          return err;
        });
      }

      ///// consulta rk_usuario
      i = 0;
      let cntRkHcUsuario = res['rk_hc_usuario'].length;
      let rkHcUsuario = 'INSERT INTO rk_hc_usuario (id,cedula,clave,correo,estado,exportador_id,fecha_cre,fecha_mod,nombre,ultimo_ingreso,usuario_cre_id,usuario_mod_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

      for (i = 0; i < cntRkHcUsuario; i++) {
        let data = [res['rk_hc_usuario'][i].id,res['rk_hc_usuario'][i].cedula,res['rk_hc_usuario'][i].clave,res['rk_hc_usuario'][i].correo,
                   res['rk_hc_usuario'][i].estado,res['rk_hc_usuario'][i].exportador_id,res['rk_hc_usuario'][i].fecha_cre,
                   res['rk_hc_usuario'][i].fecha_mod,res['rk_hc_usuario'][i].nombre,res['rk_hc_usuario'][i].ultimo_ingreso,
                   res['rk_hc_usuario'][i].usuario_cre_id,res['rk_hc_usuario'][i].usuario_mod_id];
        db.executeSql(rkHcUsuario, data)
         .catch(err =>{
          return err;
         });
      }

    });
  }
}
