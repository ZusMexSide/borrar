import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoginComponent } from './login/login.component';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


var firebaseConfig = {
  apiKey: 'AIzaSyD7Bnl4A0Hvt1DF7LeB-BXRlvW3YH3zeWY',
  authDomain: 'houseiot-abb0f.firebaseapp.com',
  databaseURL: 'https://houseiot-abb0f.firebaseio.com',
  projectId: 'houseiot-abb0f',
  storageBucket: 'houseiot-abb0f.appspot.com',
  messagingSenderId: '444333926793',
  appId: '1:444333926793:web:5a373c2827dac366589958'
};
@NgModule({
  declarations: [AppComponent, LoginComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    OneSignal,
    Facebook,
    NativeStorage,
    GooglePlus
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
