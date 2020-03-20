import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
data: any;
  constructor(private storage: NativeStorage) {
    this.storage.getItem('facebook_user').then((res) => {
      this.data = res;
    });
   }
  ngOnInit() {
  }

}
