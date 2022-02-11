import { Component } from '@angular/core';
import { Sync } from '../../services/model/sync.service';
import { BehaviorSubject } from 'rxjs';
import { MsgTemplateService } from '../../services/utilitarios/msg-template.service';
import { DbService } from '../../services/model/db.service';
import { DbQuery } from '../../services/model/dbQuerys.service';

interface Componente {
  icon: string;
  name: string;
  color: string;
  redirecTo: string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage {

  componentes: Componente[] = [
    {
      icon: 'newspaper',
      name: 'Mancha Angular',
      color: 'danger',
      redirecTo: '/action-sheet'
    }
  ];

  //menuTemp = [
    //{ 'nombre': 'MANCHA ANGULAR', 'icono': 'print', 'clase': 'Comex', 'ruta': '/action-sheet', 'valor': 'MANANG', 'estado': '' },
    //{ 'nombre': 'MALFORMACION Y MICROACARO', 'icono': 'ticket', 'clase': 'Compras', 'ruta': '/action-sheet', 'valor': 'MALMIC', 'estado': 'disabled' },
    //{ 'nombre': 'OÍDIO', 'icono': 'eye', 'clase': 'Planta', 'ruta': '/action-sheet', 'valor': 'OÍDIO', 'estado': 'disabled' },
    //{ 'nombre': 'MUERTE DESCENDENTE', 'icono': 'cubes', 'clase': 'Contabilidad', 'ruta': '/action-sheet', 'valor': 'MUEDES', 'estado': 'disabled' },
    //{ 'nombre': 'PULGON', 'icono': 'archive', 'clase': 'RRHH', 'ruta': '/action-sheet', 'valor': 'PULGON', 'estado': 'disabled' },
    //{ 'nombre': 'TRIPS', 'icono': 'building-o', 'clase': 'DOCUMENTACION', 'ruta': '/action-sheet', 'valor': 'TRIPS', 'estado': 'disabled' },
    //{ 'nombre': 'MANCHA DE ALTERNARIA', 'icono': 'columns', 'clase': 'Contabilidad', 'ruta': '/action-sheet', 'valor': 'MANALT', 'estado': 'disabled' },
    //{ 'nombre': 'ANTRACNOSIS', 'icono': 'list-ul ', 'clase': 'Inventario', 'ruta': '/action-sheet', 'valor': 'ANTRAC', 'estado': 'disabled' },
    //{ 'nombre': 'ENEMIGOS NATURALES', 'icono': 'clock-o', 'clase': 'RRHH', 'ruta': '/action-sheet', 'valor': 'ENENAT', 'estado': 'disabled' },
    //{ 'nombre': 'COCHINILLA', 'icono': 'columns', 'clase': 'Planta', 'ruta': '/action-sheet', 'valor': 'COCHIN', 'estado': 'disabled' },
    //{ 'nombre': 'MOSCA DE FRUTA', 'icono': 'columns', 'clase': 'Comex', 'ruta': '/action-sheet', 'valor': 'MOSFRU', 'estado': 'disabled' },
    //{ 'nombre': 'LEPIDÓPTEROS', 'icono': 'columns', 'clase': 'Contabilidad', 'ruta': '/action-sheet', 'valor': 'LEPIDO', 'estado': 'disabled' },
    //{ 'nombre': 'OTRAS PLAGAS', 'icono': 'columns', 'clase': 'Compras', 'ruta': '/action-sheet', 'valor': 'OTRPLA', 'estado': 'disabled' },
  //];


  menuTemp: any[] = [];
  /* menuTempUtilitarios   = [
    {'nombre':  'DESCARGAR DATOS', 'icono' : 'refresh', 'clase' : 'Comex', 'ruta' : `syncronize()`, 'estado' : ''},
    {'nombre':  'SUBIR DATOS', 'icono' : 'upload', 'clase' : 'Planta', 'ruta' : '#', 'estado' : 'disabled'},
  ];*/


  constructor(private db: Sync, private msgService: MsgTemplateService, private db2: DbService, private DbQuery: DbQuery) {
    let sql = `select rhf.*
                from rk_hc_persona_formulario_hacienda rh
                inner join rk_hc_formulario rhf on rhf.id = rh.formulario_id
                where rh.usuario_id = ${localStorage.getItem('id_usuario')} and rh.estado = ?
                GROUP BY rh.formulario_id`;
    //let sql = `select * from rk_hc_persona_formulario_hacienda where estado = ?`;
    this.DbQuery.consultaAll('db', sql, 'A').then((item) => {
      //console.log(item);
      this.menuTemp = item;
    });
    //this.syncronize();
  }
  data = new BehaviorSubject([]);

  async syncronize() {
    let loading = await this.msgService.loadingCreate('Sincronizando datos por favor espere...');
    this.msgService.loading(true, loading)
      this.db.syncData().then(() => {
        this.msgService.loading(false, loading)
      });
  }
   declare l:any;
   async initLoad() {
    const loading = await this.msgService.loadingCreate('Cargando por favor espere...');
    this.msgService.loading(true, loading)
    this.l=loading;
  }
   ionViewDidLeave() {
    this.msgService.loading(false,  this.l)
  }
}
