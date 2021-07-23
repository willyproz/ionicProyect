import { Component } from '@angular/core';
import { Sync } from 'src/app/services/model/sync.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';

interface Componente{
  icon:string;
  name:string;
  color:string;
  redirecTo:string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage {

  componentes:Componente[]=[
    {
      icon:'newspaper',
      name:'Mancha Angular',
      color:'danger',
      redirecTo:'/action-sheet'
    }
  ];

  menuTemp   = [
    {'nombre':  'MANCHA ANGULAR', 'icono' : 'print', 'clase' : 'Comex', 'ruta' : '/action-sheet', 'valor':'MANANG' , 'estado' : ''},
    {'nombre':  'MALFORMACION Y MICROACARO', 'icono' : 'ticket', 'clase' : 'Compras', 'ruta' : '/action-sheet', 'valor':'MALMIC', 'estado' : 'disabled'},
    {'nombre':  'OÍDIO', 'icono' : 'eye', 'clase' : 'Planta', 'ruta' : '/action-sheet', 'valor':'OÍDIO', 'estado': 'disabled'},
    {'nombre' : 'MUERTE DESCENDENTE', 'icono' : 'cubes', 'clase' : 'Contabilidad', 'ruta' : '/action-sheet', 'valor':'MUEDES', 'estado' : 'disabled'},
    {'nombre' : 'PULGON', 'icono' : 'archive', 'clase' : 'RRHH', 'ruta' : '/action-sheet', 'valor':'PULGON', 'estado' : 'disabled'},
    {'nombre' : 'TRIPS', 'icono': 'building-o', 'clase': 'DOCUMENTACION', 'ruta' : '/action-sheet', 'valor':'TRIPS', 'estado': 'disabled'},
    {'nombre' : 'MANCHA DE ALTERNARIA', 'icono' : 'columns', 'clase' : 'Contabilidad', 'ruta' : '/action-sheet', 'valor':'MANALT', 'estado' : 'disabled'},
    {'nombre' : 'ANTRACNOSIS', 'icono' : 'list-ul ', 'clase' : 'Inventario', 'ruta' : '/action-sheet', 'valor':'ANTRAC', 'estado' : 'disabled'},
    {'nombre' : 'ENEMIGOS NATURALES', 'icono' : 'clock-o', 'clase' : 'RRHH', 'ruta' : '/action-sheet', 'valor':'ENENAT', 'estado' : 'disabled'},
    {'nombre' : 'COCHINILLA', 'icono' : 'columns', 'clase' : 'Planta', 'ruta' : '/action-sheet', 'valor':'COCHIN', 'estado' : 'disabled'},
    {'nombre' : 'MOSCA DE FRUTA', 'icono' : 'columns', 'clase' : 'Comex', 'ruta' : '/action-sheet', 'valor':'MOSFRU', 'estado' : 'disabled'},
    {'nombre' : 'LEPIDÓPTEROS', 'icono' : 'columns', 'clase' : 'Contabilidad', 'ruta' : '/action-sheet', 'valor':'LEPIDO', 'estado' : 'disabled'},
    {'nombre' : 'OTRAS PLAGAS', 'icono' : 'columns', 'clase' : 'Compras', 'ruta' : '/action-sheet', 'valor':'OTRPLA', 'estado' : 'disabled'},
 ];



/* menuTempUtilitarios   = [
  {'nombre':  'DESCARGAR DATOS', 'icono' : 'refresh', 'clase' : 'Comex', 'ruta' : `syncronize()`, 'estado' : ''},
  {'nombre':  'SUBIR DATOS', 'icono' : 'upload', 'clase' : 'Planta', 'ruta' : '#', 'estado' : 'disabled'},
];*/
  constructor(private db: Sync, private loadingCtrl: LoadingController) {
    this.syncronize();
   }
  data = new BehaviorSubject([]);
 async syncronize(){
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      spinner:'dots',
      message: 'Sincronizando datos por favor espere...',
    });
    this.loading(true,loading);
    this.db.openOrCreateDB().then( res => {
      this.db.syncData(res).then((r)=>{
        this.loading(false,loading);
      }
      );
    });

  }

 async loading(inicio,loading) {
    if(inicio === true){
      await loading.present();
    }else if(inicio === false){
      await loading.dismiss();
    }
  }

  /*<div class="sk-cube-grid">
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
  </div>

  <style>
        .sk-cube-grid {
        width: 40px;
        height: 40px;
        margin: 100px auto;
      }

      .sk-cube-grid .sk-cube {
        width: 33%;
        height: 33%;
        background-color: #333;
        float: left;
        -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
                animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
      }
      .sk-cube-grid .sk-cube1 {
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      .sk-cube-grid .sk-cube2 {
        -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s; }
      .sk-cube-grid .sk-cube3 {
        -webkit-animation-delay: 0.4s;
                animation-delay: 0.4s; }
      .sk-cube-grid .sk-cube4 {
        -webkit-animation-delay: 0.1s;
                animation-delay: 0.1s; }
      .sk-cube-grid .sk-cube5 {
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }
      .sk-cube-grid .sk-cube6 {
        -webkit-animation-delay: 0.3s;
                animation-delay: 0.3s; }
      .sk-cube-grid .sk-cube7 {
        -webkit-animation-delay: 0s;
                animation-delay: 0s; }
      .sk-cube-grid .sk-cube8 {
        -webkit-animation-delay: 0.1s;
                animation-delay: 0.1s; }
      .sk-cube-grid .sk-cube9 {
        -webkit-animation-delay: 0.2s;
                animation-delay: 0.2s; }

      @-webkit-keyframes sk-cubeGridScaleDelay {
        0%, 70%, 100% {
          -webkit-transform: scale3D(1, 1, 1);
                  transform: scale3D(1, 1, 1);
        } 35% {
          -webkit-transform: scale3D(0, 0, 1);
                  transform: scale3D(0, 0, 1);
        }
      }

      @keyframes sk-cubeGridScaleDelay {
        0%, 70%, 100% {
          -webkit-transform: scale3D(1, 1, 1);
                  transform: scale3D(1, 1, 1);
        } 35% {
          -webkit-transform: scale3D(0, 0, 1);
                  transform: scale3D(0, 0, 1);
        }
      }
  </style>*/
}
