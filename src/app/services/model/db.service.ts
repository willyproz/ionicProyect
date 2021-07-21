import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { catchError, map, tap } from 'rxjs/operators';

import { rk_hc_form_cab } from '../../model/rk_hc_form_cab';


@Injectable({
  providedIn: 'root'
})

export class DbService {
  public storage: SQLiteObject;
  formularioList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public respuesta: any;

  constructor(private platform: Platform,private sqlite: SQLite,private httpClient: HttpClient, private sqlPorter: SQLitePorter)
  {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'positronx_db.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
      });
    });
  }

  dbState(){return this.isDbReady.asObservable();}

  fetchFormulario(): Observable<rk_hc_form_cab[]> {return this.formularioList.asObservable();}

    // Render fake data
    getFakeData() {
      this.httpClient.get(
        'assets/dump.sql',
        {responseType: 'text'}
      ).subscribe(data => {
        this.sqlPorter.importSqlToDb(this.storage, data)
          .then(_ => {
            //this.formularioService.getAllFormularios();
           // this.getFormularios();
            this.isDbReady.next(true);
          })
          .catch(error => console.error(error));
      });
    }


  // Get list
  getAllFormularios(){
    return this.storage.executeSql('SELECT * FROM rk_hc_form_cab', []).then(res => {
      let items: rk_hc_form_cab[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            hacienda_id: res.rows.item(i).hacienda_id,
            lote: res.rows.item(i).lote,
            modulo: res.rows.item(i).modulo,
            empresa_id: res.rows.item(i).empresa_id,
            tipo_muestra_id: res.rows.item(i).tipo_muestra_id,
            observacion: res.rows.item(i).observacion,
            estado: res.rows.item(i).estado,
            usuario_cre_id: res.rows.item(i).usuario_cre_id,
            fecha_cre: res.rows.item(i).fecha_cre,
            usuario_mod_id: res.rows.item(i).usuario_mod_id,
            fecha_mod: res.rows.item(i).fecha_mod
          }
            );
        }
      }
      this.formularioList.next(items);
    });
  }

  // Add
  insertarNuevoFormulario(hacienda_id,lote,modulo,tipo_muestra_id) {
    let data = [hacienda_id,lote,modulo,tipo_muestra_id];
   // console.log(data);
    return this.storage.executeSql('INSERT INTO rk_hc_form_cab (hacienda_id,lote,modulo,tipo_muestra_id) VALUES (?,?,?,?)', data)
    .then(res => {
      if(res.rowsAffected > 0){
        this.getAllFormularios();
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
//      console.log(res);
    });
  }


  async syncData(){
    await this.httpClient.post('http://200.0.73.169:189/procesos/syncHacienda',{}).toPromise()
    .then( res => {
      console.log(res['rk_hc_hacienda']);
      console.log('la longitud es: '+res['rk_hc_hacienda'].length);
      let cntRkHcHacienda = res['rk_hc_hacienda'].length;
      let rkHcFormCab = 'INSERT INTO rk_hc_hacienda (id,sigla,nombre,estado) VALUES (?,?,?,?)';
      let i:number = 0;
      for (i = 0; i < cntRkHcHacienda; i++) {
        let data = [res['rk_hc_hacienda'][i].id,res['rk_hc_hacienda'][i].sigla,res['rk_hc_hacienda'][i].nombre,res['rk_hc_hacienda'][i].estado];
        this.storage.executeSql(rkHcFormCab, data)
          .then(res => {  
            if(res.rowsAffected > 0){
              this.respuesta = {
                estado:'ok',
                mensaje: 'Columnas afectadas: '+ res.rowsAffected + ' , Id insertado: '+res.insertId
              }
            }else{
              this.respuesta = {
                estado:'error',
                mensaje: res.message
              }
            }
            console.log(this.respuesta);
          }).catch(err => {
           return this.respuesta = {
              estado:'error',
              mensaje: err.message
            }
          //  console.log(this.respuesta);
          });
      }
    });
    /*.subscribe((res:any[]) =>{
      console.log(res);
     /* this.syncDataRes = res['rk_hc_hacienda'][0];
      return this.syncDataRes;*/
     /*});*/
    
  
    
   /*
    let rkHcFormCab = 'INSERT INTO rk_hc_form_cab (hacienda_id,lote,modulo,tipo_muestra_id) VALUES (?,?,?,?)';
    let i:number;

    for (i = 0; i < 6; i++) {
      this.storage.executeSql(rkHcFormCab, data)
        .then(res => {  
          
        });
      }*/
  }
}
