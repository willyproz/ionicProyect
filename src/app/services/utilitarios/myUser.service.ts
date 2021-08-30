import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyUserService {
  constructor() { }

  dateNow() {
   var hoy = new Date().toTimeString().split('GMT-0500');
   var dt = new Date().toISOString().split('T');
    let fecha = dt[0];
    let time = hoy[0];
    let fechaFinal = fecha + " " + time;
    return fechaFinal;
  }


}
