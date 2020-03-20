import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IotFirebaseService } from '../service/iot-firebase.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  @ViewChild('chart', {static: false}) chart;
  bars: any;
  array: any = [];
  history: any = [];
  dates: any = [];
  states: any = [];
  show = false;
  showSplash = true;
  suscription: Subscription;
  constructor(private houseIoTService: IotFirebaseService) {
    this.suscription = this.houseIoTService.getStatus()
      .subscribe((res) => {
        this.array = res;
        console.log(this.array);
      });
    setTimeout(() => {
      this.showSplash = false;
      this.show = true;
    }, 3000);
  }

  updateStatus(e, idDocument: any) {
    // declaramos todas las variables a utilizar
    let status;
    let today;
    let todayTime;
    let currentDate;
    let lastTimeDiff;
    let newTimeDiff;
    // asignamos el valor que obtenemos del foco
    if (e.detail.checked === true) {
      status = true;
    } else {
      status = false;
    }
    // obtenemos el tamaño del documento historial de firebase
    const length = this.cargarHistorial(idDocument);
    // creamos nueva fecha para saber que dia es y lo guardamos en una variable con el formato d-m-a
    today = new Date();
    currentDate = `${today.getDate() < 10 ? 0 + today.getDate() : today.getDate()}-${10 > (today.getMonth() + 1)  ? 0 + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getFullYear()}`;
    todayTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    // evaluamos si hay o no historial
    if (length === 0) {
      this.houseIoTService.insertNewDay(idDocument, length, currentDate);
      this.houseIoTService.updateStatus(status, idDocument, length, todayTime, '0');
    } else {
      // cuando hay historial comparamos si nos encontramos en el mismo dia o en otro
    if (this.history[length - 1].fecha < currentDate) {
      // si estamos en otro dia debemos calcular el tiempo que transcurrio hasta las 23:59:59 del dia anterior
      // para no mezclar el tiempo de uso, en caso de que el foco haya quedado encendido (true). Para eso
      // vamos a evaluar si el foco quedó encendido o apagado
      if (this.history[length - 1].state === true) {
        // calculamos el tiempo que duro prendido antes de las 12 en lastTimeDiff
        const lastTime = moment.duration(this.history[length - 1].referencia);
        let end = moment.duration('24:00:00');
        lastTimeDiff = end.subtract(lastTime);
        // en newTimeDiff guardamos lo que ha estado prendido despues de las 12
        const start = moment.duration('00:00:00');
        end = moment.duration(todayTime);
        newTimeDiff = end.subtract(start);
        // actualizamos el tiempo acumulado mas el que obtuvimos en lastTimeDiff de el dia anterior
        const acumulador = moment.duration(this.history[length - 1].tiempo);
        acumulador.add(lastTimeDiff);
        // actualizamos el dia anterior y luego actualizamos el dia actual o sea hoy
        this.houseIoTService.updateStatus( !status , idDocument, length - 1, '0',
        `${acumulador.hours()}:${acumulador.minutes()}:${acumulador.seconds()}`).then(() => {
          this.houseIoTService.insertNewDay(idDocument, length, currentDate);
          this.houseIoTService.updateStatus(status, idDocument, length, todayTime,
          `${newTimeDiff.hours()}:${newTimeDiff.minutes()}:${newTimeDiff.seconds()}`);
        });
      } else {
        // esto se ejecuta si el foco no estaba prendido
        this.houseIoTService.insertNewDay(idDocument, length, currentDate);
        this.houseIoTService.updateStatus(status, idDocument, length, todayTime, '00:00:00');
      }
    } else {
      // esto se ejecuta si estamos en el mismo dia
      const ref = moment.duration(this.history[length - 1].referencia);
      const timeAcum =  moment.duration(this.history[length - 1].tiempo);
      const onOff = this.history[length - 1].state;
      let result;
      // si el foco se va a apagar calculamos el tiempo que estuvo encendido
      if (onOff) {
        console.log('entro al if de apagar el foco');
        const final = moment.duration(todayTime);
        const resultRest = final.subtract(ref);
        resultRest.add(timeAcum);
        result = `${resultRest.hours()}:${resultRest.minutes()}:${resultRest.seconds()}`;
      } else {
        result = this.history[length - 1].tiempo;
      }
      this.houseIoTService.updateStatus(status, idDocument, length - 1, todayTime, result);
    }
  }
  }
  cargarChart(id: any) {
    this.dates = [];
    this.states = [];
    this.cargarHistorial(id);
    this.history.forEach(element => {
      this.dates.push(element.fecha);
      this.states.push(moment.duration(element.tiempo).asMinutes());
    });
    if (this.bars) {
      this.bars.destroy();
    }
    if (this.history.length !== 0) {
    this.bars = new Chart(this.chart.nativeElement, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [{
          label: 'Total en minutos',
          data: this.states,
          backgroundColor: '#33FFD8',
          borderColor: '9A33FF',
          borderWidth: 1,
          fill: 'start'
        }]
      },
      options: {
        options: {
      },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          yAxisID: 'Minutos'
        }
      }
    });
    }
  }
  cargarHistorial(id: any) {
    let array = [];
    this.history = [];
    if (this.array[id - 1].historial !== undefined) {
      array = this.array[id - 1].historial;
      let count = 0;
      while (true) {
        if (array[count] === undefined) {
          break;
        } else {
          this.history.push(array[count]);
        }
        count++;
      }
      return this.history.length;
    } else {
      return 0;
    }
  }
  ngOnInit() { }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  getValue(value, foco: string) {
    console.log(value + foco);
  }

}
