import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MsgTemplateService {

  constructor(public loadingCtrl: LoadingController) { }


  msgOk(msg: string = 'Datos grabados con exito') {
   //  Swal.fire(msg, '', 'success');

   Swal.fire({
    title: '<strong>'+msg+'</strong>',
    icon: 'success',
    confirmButtonText:
      '<span style="font-size: 18px !important">OK</span>'
  });

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }

  msgInfo(msg: string = 'Datos grabados con exito') {
   //   Swal.fire(msg, '', 'info');

   Swal.fire({
    title: '<strong>'+msg+'</strong>',
    icon: 'info',
    confirmButtonText:
      '<span style="font-size: 18px !important">OK</span>'
  });

    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
  }

  msgError(msg: string) {
   //Swal.fire(msg,'', 'error');
    //confirmButtonText:     '<span style="font-size: 17px !important"><i class="fa fa-close"></i> OK :( </span>'
    Swal.fire({
      title: '<strong>'+msg+'</strong>',
      icon: 'error',
      confirmButtonText:
        '<span style="font-size: 18px !important"><i class="fa fa-frown-o"></i> OK</span>'
    });
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
      confirmButtonText: `<span style="font-size: 18px !important">SI</span>`,
      denyButtonText: `<span style="font-size: 18px !important">NO</span>`
    });
    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
    return msgConfirmed;
  }

  async toastMsg(msg: any = '', icon: any = 'success', position: any = 'top-end') {

    let color = '';
    if (icon == 'success') {
      color = '#a5dc86';
    } else if (icon == 'error') {
      color = '#f27474';
    } else if (icon == 'warning') {
      color = '#f8bb86';
    } else if (icon == 'info') {
      color = '#3fc3ee';
    } else if (icon == 'question') {
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
      html: '<span style="color: white; font-size:14px"><b>'+msg+'</b></span>'
    })
  }


  async MsgAutoClose(msg: any = '', icon: any = 'success', position: any = 'top-end') {
   await Swal.fire({
      position: position,
      icon: icon,
      title: msg,
      showConfirmButton: false,
      timer: 1500
    })
    var el = document.querySelector('body')!;
    el.classList.remove("swal2-height-auto");
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
