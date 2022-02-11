import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { DbQuery } from 'src/app/services/model/dbQuerys.service';
import { MyUserService } from 'src/app/services/utilitarios/myUser.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { MsgTemplateService } from 'src/app/services/utilitarios/msg-template.service';

declare var window: any;
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
    private camera: Camera,
    private file: File,
    private mediaCapture: MediaCapture,
    private MyUser: MyUserService,
    private msg: MsgTemplateService) { 
      window.insertarImagen = function (data: any, tipo_pag: string, tipo_ubicacion: string, img: string,id_usuario:any,tipo_form:any,tempImagesCons:any,tempImagesTabla:any) {
        let resultado = data.split('_');
        let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${id_usuario} and tipo_form = '${tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
        dbQuery.consultaAll('db', sql, 'N').then(result => {
          let data = [
            result[0].id,
            resultado[0],
            resultado[1],
            resultado[2],
            img,
            tipo_pag,
            tipo_ubicacion,
            id_usuario,
            MyUser.dateNow()
          ];
              let sql = 'INSERT INTO rk_hc_form_files (formulario_id,linea,cuadrante,rama,img,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
              dbQuery.insertar('db', sql, data);
              msg.toastMsg('Imagen guardada con exito.', 'success');
              //window.consultarImagenes(tipo_pag,id_usuario,tempImagesTabla,tempImagesCons);
            }).catch(e => {
              console.log(e);
            });
      
      }
    }

  ngOnInit() {
    this.consultarTabla();
    this.consultarImagenes();
  }


  consultarTabla() {
    let sql = `SELECT d.* FROM rk_hc_form_det d
                 INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
                 WHERE d.tipo_pag = '${this.tipo}' and rhfc.tipo_form = '${this.tipo_form}' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?`;
    this.dbQuery.consultaAll('db', sql, 'N')
      .then(async item => {
        this.TablaFormularioDet = item;
        await Object.entries(item).forEach(([key, element]: any) => {
          this.FormularioDet['L' + element.linea + '_' + element.nombre + '_' + element.nombre2] = element
        })
        // console.log(this.FormularioDet);
      }).catch(err => {

      });
  }

  async insertarFormulario(formulario: NgForm) {

    await Object.entries(formulario.value).forEach(async ([key, element]: any) => {
      let keyValid = key.indexOf('L');
      if (keyValid >= 0 && element.length !== 0) {
        let resultado = element.split('_');
        let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
        this.dbQuery.consultaAll('db', sql, 'N').then(result => {
          //console.log('id:' + result[0].id);
          let sql1 = `SELECT count(*) as cnt, id FROM rk_hc_form_det WHERE formulario_id = ${result[0].id} and linea = ${resultado[0]} and nombre = '${resultado[1]}' and nombre2 = '${resultado[2]}' and tipo_pag = '${formulario.value.tipo_pag}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? `;
          this.dbQuery.consultaAll('db', sql1, 'A')
            .then(resp => {
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
                this.dbQuery.db.executeSql(`UPDATE rk_hc_form_det SET formulario_id = ?, linea = ?,nombre=?,nombre2=?,valor2=?,tipo_pag=?,tipo_ubicacion=?,usuario_cre_id=?,fecha_cre=? WHERE id = ${resp[0].id}`, data)
              } else {
                let sql = 'INSERT INTO rk_hc_form_det (formulario_id,linea,nombre,nombre2,valor2,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
                this.dbQuery.insertar('db', sql, data);
              }
              this.consultarTabla();
              this.msg.toastMsg('Registro grabado.', 'success');
            });
        });
      }
    });
  }

  // CODIGO PARA GRABAR SECCION SUBIDA DE IMAGENES
  tempImagesTabla: any[] = [];
  tempImagesCons: any[] = [];
  modoCamaraBool: boolean = true;
  modoCamara() {
    if (this.modoCamaraBool == true) {
      this.modoCamaraBool = false;
    } else {
      this.modoCamaraBool = true;
      this.consultarTabla();
      this.consultarImagenes();
    }
    //console.log("modo camara: " + this.modoCamaraBool);
  }

  camara(info: any, tipo_pag: string, tipo_ubicacion: string) {
    let options: CaptureImageOptions = { limit: 1 }
    this.mediaCapture.captureImage(options)
      .then(
        (data: MediaFile[]) => {
          
        // Convertir imagen
        this.obtenerContenidoComoBase64(data[0].localURL,this.tipo_form,this.tempImagesCons,this.tempImagesTabla, function(tipo_form,tempImagesCons,tempImagesTabla,base64Image){

        window.insertarImagen(info, tipo_pag, tipo_ubicacion, base64Image,localStorage.getItem('id_usuario'),tipo_form,tempImagesCons,tempImagesTabla);

        });
          
        },
        (err: CaptureError) => console.error(err)
      );

  }

  /*modoCamara() {
    if (this.modoCamaraBool == true) {
      this.modoCamaraBool = false;
    } else {
      this.modoCamaraBool = true;
    }
    //console.log("modo camara: " + this.modoCamaraBool);
  }

  camara(info: any, tipo_pag: string, tipo_ubicacion: string) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {

      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.insertarImagen(info, tipo_pag, tipo_ubicacion, base64Image);

    }, (err) => {
      // Handle error
    });
  }*/

/*
  insertarImagen(data: any, tipo_pag: string, tipo_ubicacion: string, img: any) {
    let resultado = data.split('_');
    let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
    this.dbQuery.consultaAll('db', sql, 'N').then(result => {
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
      let sql = 'INSERT INTO rk_hc_form_files (formulario_id,linea,cuadrante,rama,img,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
      this.dbQuery.insertar('db', sql, data);
      this.consultarImagenes();
    }).catch(e => {
      console.log(e);
    });
  }*/


  consultarImagenes() {

    let sql = `SELECT d.formulario_id,count(*) as cnt,d.linea,d.cuadrante,d.rama FROM rk_hc_form_files d
             INNER JOIN rk_hc_form_cab rhfc on rhfc.id = d.formulario_id
             WHERE d.tipo_pag = '${this.tipo}' and rhfc.tipo_form = '${this.tipo_form}' and d.tipo_ubicacion = 'R' and d.usuario_cre_id = ${localStorage.getItem('id_usuario')} and rhfc.liquidado = ?
             GROUP BY d.cuadrante, d.linea, d.rama`;
    this.dbQuery.consultaAll('db', sql, 'N')
      .then(item => {
        this.tempImagesTabla = item;
        Object.entries(item).forEach(([key, element]: any) => {
          this.tempImagesCons['L' + element.linea + '_' + element.cuadrante + '_' + element.rama] = element
        })
      }).catch(e => {
        console.log(e);
      });
  }

  hiddenTable: any = 'hidden';
  validarRol() {
    let sql = `SELECT count(*) as cnt FROM rk_hc_usuario WHERE id = ${localStorage.getItem('id_usuario')} and administrador = 'S' and estado = ?`;
    this.dbQuery.consultaAll('db', sql, 'A').then((res) => {
      if (res[0].cnt > 0) {
        this.hiddenTable = '';
      } else {
        this.hiddenTable = 'hidden';
      }
    });
  }

  onGuardarRamaChange($event, tipo_pag?: any, tipo_ubicacion?: any) {
    let valor = $event.target.value
    console.log(valor);
    console.log(tipo_pag);
    console.log(tipo_ubicacion);
    this.addRamaBD(valor, tipo_pag, tipo_ubicacion);
  }

  async addRamaBD(valor: any, tipo_pag?: any, tipo_ubicacion?: any) {
    let resultado = valor.split('_');
    let sql = `SELECT id FROM rk_hc_form_cab WHERE usuario_cre_id = ${localStorage.getItem('id_usuario')} and tipo_form = '${this.tipo_form}' and liquidado = ? ORDER BY id DESC LIMIT 1`;
    this.dbQuery.consultaAll('db', sql, 'N').then(result => {
      let sql1 = `SELECT count(*) as cnt, id FROM rk_hc_form_det WHERE formulario_id = ${result[0].id} and linea = ${resultado[0]} and nombre = '${resultado[1]}' and nombre2 = '${resultado[2]}' and tipo_pag = '${tipo_pag}' and usuario_cre_id = ${localStorage.getItem('id_usuario')} and estado = ? `;
      this.dbQuery.consultaAll('db', sql1, 'A')
        .then(resp => {
          let data = [
            result[0].id,
            resultado[0],                         //linea
            resultado[1],                   //cuadrante
            resultado[2],                   //rama
            resultado[3],                         //valor rama
            tipo_pag,
            tipo_ubicacion,
            localStorage.getItem('id_usuario'),
            this.MyUser.dateNow()
          ];
          if (resp[0].cnt > 0) {
            this.dbQuery.db.executeSql(`UPDATE rk_hc_form_det SET formulario_id = ?, linea = ?,nombre=?,nombre2=?,valor2=?,tipo_pag=?,tipo_ubicacion=?,usuario_cre_id=?,fecha_cre=? WHERE id = ${resp[0].id}`, data)
              .then(() => {
                this.msg.toastMsg('Registro actualizado.', 'info');
              })
              .catch((err) => {
                this.msg.toastMsg(err, 'error');
              });
          } else {
            let sql = 'INSERT INTO rk_hc_form_det (formulario_id,linea,nombre,nombre2,valor2,tipo_pag,tipo_ubicacion,usuario_cre_id,fecha_cre) VALUES (?,?,?,?,?,?,?,?,?)';
            this.dbQuery.insertar('db', sql, data).then(() => {
              this.msg.toastMsg('Registro grabado.', 'success');
            })
              .catch((err) => {
                this.msg.toastMsg(err, 'error');
              });
          }
          this.consultarTabla();

        });
    }).catch(err => {
      this.msg.toastMsg(err, 'error');
    });

  }


  /**
 * Esta función manejara la conversion de un archivo a formato base64
 *
 * @path string
 * @callback La función recibe como primer parametro el contenido de la image
 */
   obtenerContenidoComoBase64(path,a,b,c,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);
            
    function fail(e) {
        alert('No se pudo encontrar el archivo');
    }
  
    function gotFile(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
               var content = this.result;
               callback(a,b,c,content);
            };
  
            // El punto más importante, usa el método readAsDatURL del plugin
            reader.readAsDataURL(file);
        });
    }
  }

}
