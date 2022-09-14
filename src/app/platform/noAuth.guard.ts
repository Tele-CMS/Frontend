import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AgencyNoAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
        if (!localStorage.getItem('access_token')) {
            return true;
        }
        this.router.navigate(['/web/dashboard']);
        return false;
    }
}
