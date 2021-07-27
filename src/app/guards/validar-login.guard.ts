import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { DbQuery } from '../services/model/dbQuerys.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarLoginGuard implements CanActivate, CanLoad {
  public respTemp;
  constructor(private dbQuery:DbQuery, private router:Router ){
    
  }

  async validarToken(){
    await this.dbQuery.validarLogin().then((res)=>{
      this.respTemp = res;
    });
   }

  canActivate(): Observable<boolean> | boolean {
    this.validarToken();
    if(this.respTemp===false){
      this.router.navigateByUrl('/login');
    }
    return this.respTemp;
  }
  canLoad(): Observable<boolean> | boolean {
    this.validarToken();
    if(this.respTemp===false){
      this.router.navigateByUrl('/login');
    }
    return this.respTemp;
  }
}
