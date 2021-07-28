import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DbQuery } from '../services/model/dbQuerys.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarLoginGuard implements CanActivate, CanLoad {
  constructor(private dbQuery:DbQuery, private router:Router ){
    
  }


  canActivate(): Observable<boolean> | boolean {
      return this.dbQuery.validarLogin()
            .pipe(
              tap(valid=>{
                if(!valid){
                  this.router.navigateByUrl('/login');
                }
              })
            );
  }
  canLoad(): Observable<boolean> | boolean {
    return this.dbQuery.validarLogin()
    .pipe(
      tap(valid=>{
        if(!valid){
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
