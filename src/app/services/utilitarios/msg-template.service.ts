import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MsgTemplateService {

  constructor(public loadingCtrl: LoadingController) { }


  msgOk(msg: string = 'Datos grabados con exito') {
    Swal.fire("OK", msg, 'success');

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }

  msgInfo(msg: string = 'Datos grabados con exito') {
    Swal.fire(msg, '', 'info');

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }

  msgError(msg: string) {
    Swal.fire("ERROR", msg, 'error');

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }

  /*.then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Saved!', '', 'success')
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })*/

  msgConfirmar(msg: string = '¿Quieres guardar el formulario?') {
    let msgConfirmed = Swal.fire({
      title: msg,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    });
    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
    return msgConfirmed;
  }

  async toastMsg(msg: any = '', icon: any = 'success', position: any = 'top-end') {

    let color = '';
    if (icon === 'success') {
      color = '#a5dc86';
    } else if (icon === 'error') {
      color = '#f27474';
    } else if (icon === 'warning') {
      color = '#f8bb86';
    } else if (icon === 'info') {
      color = '#3fc3ee';
    } else if (icon === 'question') {
      color = '#87adbd';
    }

    const Toast = Swal.mixin({
      toast: true,
      background: color,
      iconColor: 'white',
      position: position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })

    await Toast.fire({
      icon: icon,
      title: msg
    })
  }

  async loadingCreate(msg: string) {
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      spinner: 'dots',
      message: msg
    });
    return loading;
  }

  async loading(inicio, loading) {
    if (inicio === true) {
      await loading.present();
    } else if (inicio === false) {
      await loading.dismiss();
    }
  }


}
