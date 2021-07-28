import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyUserService {

  constructor() { }

  dateNow() {
    var dt = new Date().toISOString().split('T');
    let fecha = dt[0];
    let time = dt[1].split('.')[0];
    let fechaFinal = fecha + " " + time;
    return fechaFinal;
  }


}
