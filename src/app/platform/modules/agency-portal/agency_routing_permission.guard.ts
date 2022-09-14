import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { take } from "rxjs/operators";
import { CommonService } from "../core/services";

@Injectable()
export class AgencyPermissionGuard implements CanActivate {
  constructor(private router: Router, private commonService: CommonService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.commonService.isRoutePermission(state.url)) {
      return true;
    } else {
      this.router.navigate(["/web/not-allowed"]);
      return false;
    }
  }
}
