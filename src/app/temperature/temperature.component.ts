import { Component, OnInit } from '@angular/core';
import { IotFirebaseService } from '../service/iot-firebase.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss'],
})
export class TemperatureComponent implements OnInit {

  constructor(private iotService: IotFirebaseService) {
    this.iotService.getTemperature();
   }

  ngOnInit() {}

}
