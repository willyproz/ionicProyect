import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/model/db.service';
import { ModalController } from '@ionic/angular';
import { AlertPage } from '../alert/alert.page';
import { Router } from '@angular/router';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { Sync } from 'src/app/services/model/sync.service';
import { MsgTemplateService } from 'src/app/services/utilitarios/msg-template.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private dbQuery:DbQuery ,
              public modalController: ModalController,
              private msg: MsgTemplateService,
              private Dbservices:DbService,
              private router: Router,
              private sync: Sync
              ) {}

  ngOnInit() {

  }

  menuTemp   = [
    {'nombre':  'ADMINISTRAR', 'icono' : 'print', 'clase' : 'Comex', 'ruta' : '', 'estado' : ''},
    {'nombre':  'CONSULTAR', 'icono' : 'ticket', 'clase' : 'Compras', 'ruta' : '/consulta', 'estado' : 'disabled'},
    {'nombre':  'FORMULARIOS', 'icono' : 'eye', 'clase' : 'Planta', 'ruta' : '/formulario', 'estado': 'disabled'},
 ];

 async presentModal() {
  const modal = await this.modalController.create({
    component: AlertPage
  });
  await modal.present();
  }


  async syncronize() {
    let loading = await this.msg.loadingCreate('Sincronizando datos por favor espere...');
    this.msg.loading(true, loading)
    this.sync.openOrCreateDB().then(res => {
      this.sync.syncData(res).then(() => {
        this.msg.loading(false, loading)
      });
    });
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
