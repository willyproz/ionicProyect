import { Component, OnInit } from '@angular/core';
import { DbQuery } from '../../services/model/dbQuerys.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.page.html',
  styleUrls: ['./action-sheet.page.scss'],
})
export class ActionSheetPage implements OnInit {


  constructor(
    private dbQuery: DbQuery,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  Data: any[] = [];
  FormStruct: any[] = [];
  titulo: string = '';
  ngOnInit() {
    let sigla = this.activatedRoute.snapshot.paramMap.get('id');
    this.dbQuery.openOrCreateDB().then(db => {
      this.dbQuery.consultaAll(db, 'SELECT * FROM rk_hc_tipo_formulario_cab fc LEFT JOIN rk_hc_tipo_formulario_det fd on fc.id = fd.tipo_formulario_cab_id WHERE fc.sigla = ?', sigla)
        .then(item => {
          this.titulo = item[0].nombre_formulario;
          this.FormStruct = item;
        });
    });

  }

  cnt: number = 0;

  btnAnterior() {
    if (this.cnt > 0) {
      --this.cnt;
      var inactivos = document.getElementsByClassName("fma");
      for (var i = 0; i < inactivos.length; i++) {
        inactivos[i].classList.add("hidden");
      }
      var el = document.getElementById('ma' + this.cnt)!;
      el.classList.remove("hidden");

      /*$('.fma').addClass('hidden');
      $('#ma' + this.i).removeClass('hidden');*/
    }
    console.log(this.cnt);
  }

  btnSiguiente() {
      this.dbQuery.openOrCreateDB().then(db => {
        let sql =`SELECT TOP 1 count(*) FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? order by id desc`;
        this.dbQuery.consultaAll(db, sql, 'A')
          .then(item => {
            var cntInput: any = ((document.getElementById('cntForm') as HTMLInputElement).value);
            if (this.cnt < cntInput) {
              this.cnt++;
              var inactivos = document.getElementsByClassName("fma");
              for (var i = 0; i < inactivos.length; i++) {
                inactivos[i].classList.add("hidden");
              }
              var el = document.getElementById('ma' + this.cnt)!;
              el.classList.remove("hidden");
            }
            console.log(this.cnt);
          });
      });
    }
   
  }


