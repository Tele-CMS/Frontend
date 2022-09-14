import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ClientHealthComponent } from "./client-health/client-health.component";
import { Observable } from "rxjs";
import { LayoutService } from "../../core/services";

@Injectable()
export class DiscardEncounterGuard implements CanDeactivate<ClientHealthComponent> {

  canDeactivate(
    component: ClientHealthComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    // you can just return true or false synchronously
    if (!component.isShowCreateEncounter && !component.firstTimeSavedEncounter) {
      return true;
    }
    // or, you can also handle the guard asynchronously, e.g.
    // asking the user for confirmation.
    return component.onCloseCreateEncounterForm();
  }
}