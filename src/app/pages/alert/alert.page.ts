import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  cerrarModal() {
    console.log('asd');
    this.modalController.dismiss();
  }
}
