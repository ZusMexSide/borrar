import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GuardFacebookGuard } from './guards/guard-facebook.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    canActivate: [GuardFacebookGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    canActivate: [GuardFacebookGuard],
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'temperature',
    canActivate: [GuardFacebookGuard],
    loadChildren: () => import('./temperature/temperature.module').then(m => m.TemperatureModule)
  },
  {
    path: 'humidity',
    canActivate: [GuardFacebookGuard],
    loadChildren: () => import('./humidity/humidity.module').then(m => m.HumidityModule)
  },
  {
    path: 'user',
    canActivate: [GuardFacebookGuard],
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
