import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MsgTemplateService {

  constructor(public loadingCtrl: LoadingController) { }


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

  async loadingCreate(msg:string){
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      spinner:'dots',
      message: msg
    });
    return loading;
  }

  async loading(inicio,loading) {
    if(inicio === true){
      await loading.present();
    }else if(inicio === false){
      await loading.dismiss();
    }
  }
}
