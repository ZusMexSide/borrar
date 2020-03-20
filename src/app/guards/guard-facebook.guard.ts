import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardFacebookGuard implements CanActivate {
  constructor(private auth: AuthService){}
  async canActivate() {
    if (this.auth.logged) {
      return true;
    } else {
      return false;
    }
  }
}
