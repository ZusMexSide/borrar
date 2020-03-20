import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged: boolean;
  constructor(private fb: Facebook,
              private nativeStorage: NativeStorage,
              private loadingController: LoadingController,
              private router: Router,
              private af: AngularFireAuth,
              private google: GooglePlus) {
                this.logged = false;
               }

  async presentLoading(loading) {
    return await loading.present();
  }

  async facebook() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];
    this.fb.login(permissions)
    .then(response => {
      console.log(response);
      const userId = response.authResponse.userID;
      const facebookCredential = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      this.af.auth.signInWithCredential(facebookCredential).then((res) => {
        console.log(JSON.stringify(res) , 'exitoso');
      }).catch((err) => {
        console.log(JSON.parse(err) , 'failed');
      });
      this.fb.api('/me?fields=name, email', permissions)
        .then(user => {
          user.picture = 'https://graph.facebook.com/' + userId + '/picture?type=large';
          this.nativeStorage.setItem('facebook_user',
          {
            name: user.name,
            email: user.email,
            picture: user.picture
          })
          .then(() => {
            this.logged = true;
            this.router.navigate(['/list']);
            loading.dismiss();
          }, error => {
            console.log(error);
            loading.dismiss();
          });
        });
    }, error => {
      console.log(error);
      loading.dismiss();
    });
  }

  async googleLogin(): Promise<any> {
    await this.google.login({
      scopes: 'profile email',
      webClientId: '444333926793-llcop9n7r0bshgah0iugbp5snto4hhuu.apps.googleusercontent.com',
      offline: true
    }).then(user => {
      const googleCredential = auth.GoogleAuthProvider.credential(user.credential.idToken);
      this.af.auth.signInWithCredential(googleCredential).then((res) => {
        console.log(res , 'exitoso');
      }).catch((err) => {
        console.log(err, 'failed');
      });
      this.nativeStorage.setItem('facebook_user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })
      .then(() => {
        this.router.navigate(['/list']);
      }, error => {
        console.log(error);
      });
    }, err => {
      console.log(err);
    });
  }

  async isLoggedIn(): Promise<boolean> {
    let value: boolean;
    await this.nativeStorage.getItem('facebook_user').then(() => {
     value = true;
     this.logged = true;
    }, err => {
      value = false;
      this.logged = false;
    });
    return value;
  }

  logout() {
    this.af.auth.signOut()
    .then(res => {
      console.log(res);
      this.logged = false;
      this.nativeStorage.remove('facebook_user');
      this.router.navigate(['/login']);
    }, error => {
      alert(error);
    });
  }
}
