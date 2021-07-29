import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {Md5} from 'ts-md5/dist/md5';
import {from as fromPromise,Observable } from 'rxjs';
import { map,tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class DbQuery {
  public storage: SQLiteObject;

  constructor(private platform: Platform,private sqlite: SQLite,private httpClient: HttpClient, private sqlPorter: SQLitePorter)
  {

  }

  async openOrCreateDB(){
     return await this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
         return db;
        })
        //.catch(e => console.log(e));
  }

  consultaAll(db,sql,search?){
    return db.executeSql(sql, [search]).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push(res.rows.item(i));
        }
      }
      return items;
    });
  }

  consultaLogin(db,sql,search?){
    return db.executeSql(sql, search).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push(res.rows.item(i));
        }
      }
      return items;
    });
  }

  public respuesta:any;

  insertar(db,sql,data) {
    return db.executeSql(sql, data)
    .then(res => {
      if(res.rowsAffected > 0){
        this.respuesta={
          estado:'ok',
          mensaje: 'Columnas afectadas: '+res.rowsAffected + ' , Id insertado: '+res.insertId
        }
      }else{
        this.respuesta={
          estado:'error',
          mensaje: res
        }
      }
    });
  }

  async  validarPromise(){
    let email = localStorage.getItem('user');
    let  db = await this.openOrCreateDB();
    let sql = 'SELECT clave FROM rk_hc_usuario WHERE correo = "'+email+'"'
     return await new Promise((resolve)=>{
      this.consultaLogin(db,sql)
      .then((res)=>{
        let localToken = localStorage.getItem('token');
        let emailCodec = Md5.hashStr(email);
        let verificarToken = emailCodec+res[0].clave;
        if(localToken === verificarToken){
          resolve(true);
        }else{
          resolve(false);
        }
      });
     }); 
       
     }

  validarLogin():Observable<any>{
  //  console.log('validando');
    return fromPromise(this.validarPromise());
  }

}
