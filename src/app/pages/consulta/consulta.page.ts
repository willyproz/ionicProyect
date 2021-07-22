import { Component, OnInit } from '@angular/core';
import { DbQuery } from '../../services/model/dbQuerys.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  constructor(private dbQuery: DbQuery) {}

  DataHacienda: any[] = [];
  DataUsuario: any[] = [];
  //consultaAll
  ngOnInit() {
    this.dbQuery.openOrCreateDB().then(db =>{
      this.dbQuery.consultaAll(db,'SELECT * FROM rk_hc_hacienda order by nombre asc')
      .then( item =>{
      this.DataHacienda = item;
      });

    
      this.dbQuery.consultaAll(db,'SELECT * FROM rk_hc_usuario order by nombre asc')
      .then( item =>{
        console.log(item);
      this.DataUsuario = item;
      });
    })
    
  }

}
