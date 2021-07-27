import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  public correo:string;
  public nombre:string;
  constructor(public modalController: ModalController)
  {
   this.correo =   localStorage.getItem('user');
   this.nombre =   localStorage.getItem('nombre');
  }

  ngOnInit() {
  }

  cerrarModal() {
    console.log('asd');
    this.modalController.dismiss();
  }
}
