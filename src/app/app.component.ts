import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Temperature',
      url: '/temperature',
      icon: 'thermometer'
    },
    {
      title: 'Humidity',
      url: '/humidity',
      icon: 'ios-water'
    },
    {
      title: 'User',
      url: '/user',
      icon: 'person'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private storage: NativeStorage,
    private router: Router,
    protected auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.auth.isLoggedIn().finally(() => {
        this.router.navigate(['/user']);
      }).catch(() => {
        this.router.navigate(['/login']);
      });
      this.statusBar.styleDefault();
      if (this.platform.is('cordova')) {
        this.setUpPush();
      }
  });
  }

  setUpPush() {
    this.oneSignal.startInit('59068603-2542-4a62-8fed-69e51bdca0ed', '444333926793');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe((data: any) => {
      let msg = data.playload.body;
      let title = data.playload.title;
      let additionalData = data.playload.additionalData;
      this.showAlert(title, msg, additionalData);
    });
    this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
      let additionalData = data.notification.playload.additionalData;
      this.showAlert('Notification opened', 'You already read this before', additionalData);
    });
    this.oneSignal.endInit();
  }

  async showAlert(title, msg, task) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }
}
