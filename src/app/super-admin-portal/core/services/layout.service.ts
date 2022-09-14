import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable()
export class LayoutService {
    private sidenav: MatSidenav;
    private clientDrawer: MatSidenav;


    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public setClientDrawer(clientDrawer: MatSidenav) {
        this.clientDrawer = clientDrawer;
    }

    public toggleClientDrawer(toggle?: boolean) {
        this.clientDrawer.toggle(toggle);
    }

    public open() {
        return this.sidenav.open();
    }


    public close() {
        return this.sidenav.close();
    }

    public toggle(): void {
    this.sidenav.toggle();
   }
}
