import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { MyUserService } from 'src/app/services/utilitarios/myUser.service';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-form-tabla-r',
  templateUrl: './form-tabla-r.component.html',
  styleUrls: ['./form-tabla-r.component.scss'],
})
export class FormTablaRComponent implements OnInit {

  public titulo: string = '';
  public tipo: string = '';
  public tipo_form: string = '';
  public n_rama: any;
  public headCuadranteTable: any[];
  public maxLineas: any[];
  public maxCuadrantes: any[];
  public maxNotas: any[];
  public headRamaTable: any[];

  @Input() set data(_data: any) {
    this.headCuadranteTable = Object.assign([], []);
    this.headRamaTable = Object.assign([], []);
    this.maxLineas = Object.assign([], []);
    this.maxCuadrantes = Object.assign([], []);
    this.maxNotas = Object.assign([], []);

    this.titulo = _data.nombre;
    this.tipo = _data.tipo;
    this.tipo_form = _data.sigla;

    for (let i = 0; i < _data.n_cuadrante; i++) {
      this.headCuadranteTable.push('C' + (i + 1));
      this.maxCuadrantes.push((i + 1));
    }

    for (let i = 0; i < _data.max_linea; i++) {
      this.maxLineas.push((i + 1));
    }

    for (let i = _data.nota_min; i <= _data.nota_max; i++) {
      this.maxNotas.push((i));
    }

    for (let i = 0; i < _data.n_rama; i++) {
      this.headRamaTable.push('R' + (i + 1));
    }

  }

  TablaFormularioDet: any[] = [];
  FormularioDet: any[] = [];

  constructor(public formBuilder: FormBuilder,
              private dbQuery: DbQuery,
              private camera:Camera,
              private MyUser: MyUserService) { }

  ngOnInit() {
    this.consultarTabla();
    this.consultarImagenes();
  }


  consultarTabla() {
    this.dbQuery.openOrCreateDB().then(db => {
      //let sql = `SELECT * FROM rk_hc_form_det WHERE tipo_pag = '${this.tipo}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ?`;
      let sql = `SELECT d.* FROM rk_hc_form_det d
                 INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
                 WHERE d.tipo_pag = '${this.tipo}' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?`;
      this.dbQuery.consultaAll(db, sql, 'N')
        .then(async item => {
          this.TablaFormularioDet = item;
          await Object.entries(item).forEach(([key, element]: any) =>{
            this.FormularioDet['L'+element.linea+'_'+element.nombre+'_'+element.nombre2] = element
          })
          console.log(this.FormularioDet);
        });
    });
  }

  async insertarFormulario(formulario: NgForm) {
    console.log(formulario.value);
    await Object.entries(formulario.value).forEach(async ([key, element]: any) => {
      let keyValid = key.indexOf('L');
      console.log(keyValid);
      if (keyValid >= 0 && element.length !== 0) {
        let resultado = element.split('_');
        await this.dbQuery.openOrCreateDB().then(db => {
          let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
          this.dbQuery.consultaAll(db, sql, 'N').then(result => {
            //console.log('id:' + result[0].id);
            let sql1 = `SELECT count(*) as cnt, id FROM rk_hc_form_det WHERE formulario_id = ${result[0].id} and linea = ${resultado[0]} and nombre = '${resultado[1]}' and nombre2 = '${resultado[2]}' and tipo_pag = '${formulario.value.tipo_pag}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? `;
            this.dbQuery.consultaAll(db, sql1, 'A')
              .then(resp => {
                console.log(resp);
                let data = [
                  result[0].id,                         //id formulario
                  resultado[0],                         //linea
                  resultado[1],                   //cuadrante
                  resultado[2],                   //rama
                  resultado[3],                         //valor rama
                  formulario.value.tipo_pag,            //tipo_pag
                  formulario.value.tipo_ubicacion,      //tipo_ubicacion
                  localStorage.getItem('id_usuario'),   //usuario_id
                  this.MyUser.dateNow()                 //fecha_cre
                ];
                if (resp[0].cnt > 0) {
                  db.executeSql(`UPDATE rk_hc_form_det SET formulario_id = ?, linea = ?,nombre=?,nombre2=?,valor2=?,tipo_pag=?,tipo_ubicacion=?,usuario_cre_id=?,fecha_cre=? WHERE id = ${resp[0].id}`, data)
                } else {
                  let sql = 'INSERT INTO rk_hc_form_det (formulario_id,linea,nombre,nombre2,valor2,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
                  this.dbQuery.insertar(db, sql, data);
                }
                this.consultarTabla();
              });
          });
        });
      }
    });
  }

// CODIGO PARA GRABAR SECCION SUBIDA DE IMAGENES
  tempImages:any[]=[];
  modoCamaraBool: boolean = true;
  modoCamara() {
    if (this.modoCamaraBool == true) {
      this.modoCamaraBool = false;
    } else {
      this.modoCamaraBool = true;
    }
    console.log("modo camara: "+this.modoCamaraBool);
  }

  camara(info:any,tipo_pag:string,tipo_ubicacion:string){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType:this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64 (DATA_URL):
     /* const img = window.Ionic.WebView.convertFileSrc(imageData);
      console.log(info);*/
     
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      //this.tempImages.push(base64Image);

      this.insertarImagen(info,tipo_pag,tipo_ubicacion,base64Image);

     // console.log(base64Image);
    }, (err) => {
    // Handle error
    });
  }


  insertarImagen(data:any,tipo_pag:string,tipo_ubicacion:string,img:any) {
    let resultado = data.split('_');
    this.dbQuery.openOrCreateDB().then(db => {
      let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
      this.dbQuery.consultaAll(db, sql, 'N').then(result => {
        let data = [
          result[0].id,
          resultado[0],
          resultado[1],
          resultado[2],
          img,
          tipo_pag,
          tipo_ubicacion,
          localStorage.getItem('id_usuario'),
          this.MyUser.dateNow()
        ];
        console.log(data);
        let sql = 'INSERT INTO rk_hc_form_files (formulario_id,linea,cuadrante,rama,img,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
        this.dbQuery.insertar(db, sql, data)/*.then((c)=>{
          this.msg.toastMsg('Foto agregada correctamente. Linea:'+resultado[0]+', '+resultado[1],'success');
        }).catch((err)=>{
          this.msg.toastMsg(err,'error');
        });*/
        this.consultarImagenes();
      })/*.catch(e => {
        console.log(e);
        localStorage.clear();
        this.router.navigate(['/login'])
      });*/
    });
}


consultarImagenes() {
this.dbQuery.openOrCreateDB().then(db => {
  //let sql = `SELECT *  FROM rk_hc_form_det WHERE tipo_pag = '${this.tipo}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ?`;
  let sql = `SELECT d.* FROM rk_hc_form_files d
             INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
             WHERE d.tipo_pag = '${this.tipo}' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?`;
  this.dbQuery.consultaAll(db, sql, 'N')
    .then(item => {
      this.tempImages = item;
    });
})/*.catch(e => {
  localStorage.clear();
  this.router.navigate(['/login'])
});*/
}

}
