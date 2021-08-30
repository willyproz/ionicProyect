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
 // cntRol: number;
  menuTemp: any[] = [];
  constructor(private dbQuery: DbQuery,
    public modalController: ModalController,
    private msg: MsgTemplateService,
    private router: Router,
    private sync: Sync
  ) { }

  ngOnInit() {
    this.validarRol();

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AlertPage
    });
    await modal.present();
  }

  validarRol() {
    let sql = `SELECT count(*) as cnt FROM rk_hc_usuario WHERE id = ${localStorage.getItem('id_usuario')} and administrador = 'S' and estado = ?`;
    this.dbQuery.consultaAll('db', sql, 'A').then((res) => {
      if (res[0].cnt > 0) {
        this.menuTemp = [
          { 'nombre': 'CONSULTAR', 'icono': 'ticket', 'clase': 'Compras', 'ruta': '/consulta', 'estado': 'd' },
          { 'nombre': 'FORMULARIOS', 'icono': 'eye', 'clase': 'Planta', 'ruta': '/formulario', 'estado': 'd' },
        ];
      } else {
        this.menuTemp = [
          { 'nombre': 'FORMULARIOS', 'icono': 'eye', 'clase': 'Planta', 'ruta': '/formulario', 'estado': 'd' },
        ];
      }
    });
  }

  async syncronize() {
    let loading = await this.msg.loadingCreate('Sincronizando datos por favor espere...');
    this.msg.loading(true, loading)
    this.sync.syncData().then(() => {
      this.msg.loading(false, loading)
    }).catch(e => {
      localStorage.clear();
      this.router.navigate(['/login'])
    });
  }

  async syncronizeServer() {
    this.sync.syncDataServer(this.sync.db)
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
