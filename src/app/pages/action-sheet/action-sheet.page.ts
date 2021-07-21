import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/model/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";


@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.page.html',
  styleUrls: ['./action-sheet.page.scss'],
})
export class ActionSheetPage implements OnInit {


  constructor(
    private db: DbService,
    private toast: ToastController,
    private router: Router
  ) { }
  Data: any[] = [];
  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchFormulario().subscribe(item => {
          this.Data = item
        })
      }
    });
  }


  cnt:number = 0;

  btnAnterior(){
    if (this.cnt > 0)
    {
      --this.cnt;
      var inactivos = document.getElementsByClassName("fma");
        for (var i = 0; i<inactivos.length; i++) {
          inactivos[i].classList.add("hidden");
        }
      var el = document.getElementById('ma'+this.cnt)!;
      el.classList.remove("hidden");

      /*$('.fma').addClass('hidden');
      $('#ma' + this.i).removeClass('hidden');*/
    }
    console.log(this.cnt);
  }

  btnSiguiente(){
    var cntInput:any = ((document.getElementById('cntForm') as HTMLInputElement).value);
    if (this.cnt < cntInput)
    {
      this.cnt++;
      var inactivos = document.getElementsByClassName("fma");
      for (var i = 0; i<inactivos.length; i++) {
        inactivos[i].classList.add("hidden");
      }
    var el = document.getElementById('ma'+this.cnt)!;
    el.classList.remove("hidden");
    }
    console.log(this.cnt);
  }


}
