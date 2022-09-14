import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SubDomainService } from './subDomain.service';

@Injectable()
export class SubDomainGuard implements CanActivate {
    constructor(private router: Router,
        private subDomainService: SubDomainService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.subDomainService.getSubDomainUrl()) {
            return true;
        }

        this.router.navigate(['/webadmin']);
        return false;
    }
}
