import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IotFirebaseService {
  array: any;
  values: any;
  constructor(private houseIoT: AngularFireDatabase) { }

  updateStatus(stateValue: any , idDocument: any, idHistory: any, hourMinute: any, timeSave: any): Promise<any> {
    this.houseIoT.object(`/house/${idDocument}`).update({state : stateValue});
    return this.houseIoT.object(`/house/${idDocument}/historial/${idHistory}`).update({referencia: hourMinute, state : stateValue, tiempo : timeSave});
  }
  insertNewDay(idDocument: any, newIdHistory: any, date: string) {
    this.houseIoT.object(`/house/${idDocument}/historial/${newIdHistory}`).update({fecha: date});
  }
  getStatus(): Observable<any> {
    return this.houseIoT.list('house').valueChanges();
  }
  getTemperature() {
    return this.houseIoT.database.ref('/house').child('temperatura').on('value',
   function(snapshot) {
      console.log(snapshot.val());
    });
  }
}
