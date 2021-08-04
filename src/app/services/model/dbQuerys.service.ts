import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Md5 } from 'ts-md5/dist/md5';
import { from as fromPromise, Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class DbQuery {
  public storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  db: any;
  constructor(private platform: Platform, private router: Router, private sqlite: SQLite, private httpClient: HttpClient, private sqlPorter: SQLitePorter) {
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
  dbState() { return this.isDbReady.asObservable(); }


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

  consultaAll(db, sql, search?) {
    return this.db?.executeSql(sql, [search]).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push(res.rows.item(i));
        }
      }
      return items;
    })
    /*.catch(e => {
      localStorage.clear();
      this.router.navigate(['/login'])
    });*/
  }

  consultaLogin(db, sql, search?) {
    let items: any[] = [];
    if (this.db) {
      return this.db?.executeSql(sql, search).then(res => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push(res.rows.item(i));
          }
        }
        return items;
      }).catch(e => {
        localStorage.clear();
        this.router.navigate(['/login'])
      });
    } else {
      return items.push({ clave: 'asdasd' });
    }

  }

  public respuesta: any;

  insertar(db, sql, data) {
    return this.db?.executeSql(sql, data)
      .then(res => {
        if (res.rowsAffected > 0) {
          this.respuesta = {
            estado: 'ok',
            mensaje: 'Columnas afectadas: ' + res.rowsAffected + ' , Id insertado: ' + res.insertId
          }
        } else {
          this.respuesta = {
            estado: 'error',
            mensaje: res
          }
        }
      })/*.catch(e => {
      localStorage.clear();
      this.router.navigate(['/login'])
    });*/
  }

  async validarPromise() {
    let email = localStorage.getItem('user');
    //let db = await this.openOrCreateDB();
    let sql = 'SELECT clave FROM rk_hc_usuario WHERE correo = "' + email + '"';

    return await new Promise((resolve) => {
      if (this.db) {
        this.consultaLogin('db', sql)
          .then((res) => {
            let localToken = localStorage.getItem('token');
            let emailCodec = Md5.hashStr(email);
            let verificarToken = emailCodec + res[0].clave;
            if (localToken === verificarToken) {
              resolve(true);
            } else {
              resolve(false);
            }
          }).catch(e => {
            resolve(false);
          });
      } else {
        resolve(false);
      }
    });

  }

  validarLogin(): Observable<any> {
    //  console.log('validando');
    return fromPromise(this.validarPromise());
  }

}
