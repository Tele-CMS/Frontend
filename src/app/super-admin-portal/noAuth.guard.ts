import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Injectable()
export class SuperAdminNoAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
        if (!localStorage.getItem('super-user-token')) {
            return true;
        }

        this.router.navigate(['/webadmin/dashboard']);
        return false;
    }
}
