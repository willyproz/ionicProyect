import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MsgTemplateService {

  constructor() { }


  msgOk(){
    Swal.fire("OK",'Datos grabados con exito','success');

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }

  msgError(msg:string){
    Swal.fire("ERROR",msg,'success');

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }
}
