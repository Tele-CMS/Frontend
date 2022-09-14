import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { CommonService } from '../core/services';

@Injectable()
export class ClientPermissionGuard implements CanActivate {

    constructor(private router: Router, private commonService: CommonService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  { 
        debugger
            if(this.commonService.isRoutePermissionForClient(state.url)) {
                return true;
            } else {
                this.router.navigate(['/web/not-allowed']);
                return false;
            }
    }
}
