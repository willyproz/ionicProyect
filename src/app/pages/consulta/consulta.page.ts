import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/model/db.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  constructor(private db: DbService) {}

  DataHacienda: any[] = [];
  DataUsuario: any[] = [];

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
    this.db.getAllRkHcHacienda();
    this.db.getAllRkHcUsuario();
      if(res){
        this.db.fetchRkHcHacienda().subscribe(item => {
          this.DataHacienda = item
          console.log(item);
        });
        this.db.fetchRkHcUsuario().subscribe(item => {
          this.DataUsuario = item
          console.log(item);
        });
      }
    });
  }

}
