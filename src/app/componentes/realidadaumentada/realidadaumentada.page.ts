import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
//import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-realidadaumentada',
  templateUrl: './realidadaumentada.page.html',
  styleUrls: ['./realidadaumentada.page.scss'],
})
export class RealidadaumentadaPage implements OnInit {
  //name = 'Angular ' + VERSION.major;
  // elementType = NgxQrcodeElementTypes.URL;
  // correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = 'http://mimojana.com';
  Mostrar =false;
  qrScan: any;

  constructor(private barcodeScanner: BarcodeScanner) {
   
   }

  Escanear(){
    let options: BarcodeScannerOptions = {
      prompt: 'Coloque un código QR o un código de barras dentro del rectángulo'
    }
    this.barcodeScanner.scan(options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(!barcodeData.cancelled){
        this.Mostrar = true;
      }
      //let a = JSON.stringify(barcodeData);
      //alert(a);
     }).catch(err => {
         console.log('Error', err);
     });
  
  }

  ngOnInit() {
  }

}
