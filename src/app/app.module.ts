import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Network } from '@ionic-native/network/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
//import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
//import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { GooglePlus} from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
//import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
//import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule,Ng2SearchPipeModule, IonicModule.forRoot(), AppRoutingModule,  IonicStorageModule.forRoot()],
  providers: [
    Geolocation,
    Camera,
    File,
    GooglePlus,
    Facebook,
    WebView,
    FilePath,
    Geolocation,
    //QRScanner,
    BarcodeScanner,
    MediaCapture,
    //NativeGeocoder,
    InAppBrowser,
    Media,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
