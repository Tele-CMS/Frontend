import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { CommonService } from "./modules/core/services";
import { take } from "rxjs/operators";

@Injectable()
export class AgencyAuthGuard implements CanActivate {
  constructor(private router: Router, private commonService: CommonService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem("access_token")) {
      return this.commonService.isAuthenticated.pipe(take(1));
    }
    // const queryParams = { returnUrl: state.url };
    const queryParams = {};
    //let redirectUrl = "/web/login";
    let redirectUrl = "";
    if (sessionStorage.getItem("redirectTo")) {
      redirectUrl = sessionStorage.getItem("redirectTo");
      sessionStorage.clear();
    }
    this.router.navigate([redirectUrl], { queryParams });
    return false;
  }
}
