import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HumidityComponent } from './humidity.component';



@NgModule({
  declarations: [HumidityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HumidityComponent
      }
    ])
  ]
})
export class HumidityModule { }
