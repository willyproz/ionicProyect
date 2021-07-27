import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/model/db.service';
import { ModalController } from '@ionic/angular';
import { AlertPage } from '../alert/alert.page';
import { Router } from '@angular/router';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private dbQuery:DbQuery ,public modalController: ModalController,private Dbservices:DbService,private router: Router) {}

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


  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
