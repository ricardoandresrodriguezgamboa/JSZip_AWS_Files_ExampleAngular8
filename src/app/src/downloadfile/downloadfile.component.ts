import { Component, OnInit } from '@angular/core';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import Swal from 'sweetalert2'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-downloadfile',
  templateUrl: './downloadfile.component.html',
  styleUrls: ['./downloadfile.component.css'],
  providers: [DatePipe]
})
export class DownloadfileComponent implements OnInit {

  keys_AWS = [219901194815,'ricardo.rodriguez','N°Seg=']

  urls : any = [
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(1)+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/Planilla_INFORME_VERIFICACION+-+copia+(4).xlsx',
  ];

  urlsMasive : any = [
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(1)+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(1).xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(10)+-+copia+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(11)+-+copia+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(16)+-+copia+-+copia+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(17)+-+copia+-+copia+-+copia+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/Planilla_INFORME_VERIFICACION+-+copia+(4).xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/Planilla_INFORME_VERIFICACION+-+copia+(13)+-+copia.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/Planilla_INFORME_VERIFICACION+-+copia+(8).xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/Planilla_INFORME_VERIFICACION.xlsx',
    'https://test-s3-gob.s3-us-west-2.amazonaws.com/media/public/PLANILLA-REPORTE-TRIMESTRAL-CAIGG-v2.0+(19)+-+copia+-+copia+-+copia+-+copia.xlsx'
  ];


  currentDate = new Date();

  Fecha : String = "";
  loading : boolean = false;
  FileLink : ArrayBuffer;

  constructor(private datePipe: DatePipe){
    this.Fecha = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
} 

  ngOnInit() {
  }

  donwloadDouble(){

    Swal.fire({
      title: 'Cargando...',
      text: "Espere un momento",
      allowEscapeKey : false,
      allowOutsideClick : false,
    });

    Swal.showLoading();
    
    var zip = new JSZip();

    var current_date = this.Fecha;
   
    var fecha_folder = zip.folder(current_date);

    var tema = "RT";
    var periodo = "TRIM"+'1';
    var año = this.currentDate.getFullYear();
    var ministerio = "Secretaria general de la presidencia";
    var servicio = "Subsecretaria general de la presidencia";
    var subservicio = "Subsecretaria general de la presidencia";
  

    var nomenclatura_folder = fecha_folder.folder(tema+'_'+año+'_'+periodo+'_'+ministerio.replace(/ /g, "").toUpperCase()+'_'+servicio.replace(/ /g, "").toUpperCase()+'_'+subservicio.replace(/ /g, "").toUpperCase());

        
    

    for (let i = 0; i < this.urls.length; i++) {
      
      const url = this.urls[i];

      var filename = url.substring(url.lastIndexOf('/')+1);


      var Filedata = this.urlToPromise(url);
      
      nomenclatura_folder.file(filename, Filedata);

 
      
    }

 
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content,current_date+'.zip');
        Swal.close();
    });

  

 
  
  }

 urlToPromise(url) 
{

    return new Promise(function(resolve, reject) 
    {
        JSZipUtils.getBinaryContent(url, function (err, data) 
        {
            if(err) 
            {
                reject(err);
             
               
            } else {
                resolve(data);
                
               
            }
        });
    });
}
 


 

  downloadMasive(){
    Swal.fire({
      title: 'Cargando...',
      text: "Espere un momento",
      allowEscapeKey : false,
      allowOutsideClick : false,
    });

    Swal.showLoading();
    
    var zip = new JSZip();

    var current_date = this.Fecha;
   
    var fecha_folder = zip.folder(current_date);

    var tema = "RT";
    var periodo = "TRIM"+'1';
    var año = this.currentDate.getFullYear();
    //nivel min
    var ministerio = "Secretaria general de la presidencia";
    //nivel serv
    var servicio = "Subsecretaria general de la presidencia";

    //nivel reporte tri o verif.
    var subservicio = "Subsecretaria general de la presidencia";
  

    var nomenclatura_folder = fecha_folder.folder(tema+'_'+año+'_'+periodo+'_'+ministerio.replace(/ /g, "").toUpperCase()+'_'+servicio.replace(/ /g, "").toUpperCase()+'_'+subservicio.replace(/ /g, "").toUpperCase());

    var RT = nomenclatura_folder.folder("Reporte Trimestral");
    var RV = nomenclatura_folder.folder("Reporte Verificacion");
    

    for (let i = 0; i < this.urlsMasive.length; i++) {
      
      const url = this.urlsMasive[i];
 

      var filename = url.substring(url.lastIndexOf('/')+1);


      var Filedata = this.urlToPromise(url);


      RT.file(filename, Filedata);
      RV.file(filename, Filedata);

 
      
    }

 
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content,current_date+'.zip');
        Swal.close();
    });

  
  }


  
  
}
