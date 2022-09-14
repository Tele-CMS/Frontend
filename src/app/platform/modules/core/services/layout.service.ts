import { ElementRef, Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable()
export class LayoutService {
    private ClientDrawerStateSubject = new BehaviorSubject<any>({});
    public clientDrawerData = this.ClientDrawerStateSubject.asObservable();
   

    // global state for application filters
    private AppFiltersStateSubject = new BehaviorSubject<any>({});
    public AppFiltersDrawerData = this.AppFiltersStateSubject.asObservable();

    private sidenav: MatSidenav;
    private clientDrawer: MatSidenav;
    private clientPanel: ElementRef;

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public setClientDrawer(clientDrawer: MatSidenav) {
        this.clientDrawer = clientDrawer;
    }

    public toggleClientDrawer(toggle?: boolean) {
        this.clientDrawer.toggle(toggle);
    }

    public toggleSideNav(toggle?: boolean) {
        this.sidenav.toggle(toggle);
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

   get getSideNavPanel() { return this.sidenav }


   get clientDrawerState() { return this.clientDrawer.opened } 

   changeClientDrawerData(changedState : boolean, extraParams: any, isSaved: boolean = false) { 
      
    this.ClientDrawerStateSubject.next({ changedState , ...extraParams, isSaved});
    
}

 
 
    updateAppFiltersData(data: any) {
    const previousData = this.AppFiltersStateSubject.value;
    this.AppFiltersStateSubject.next({ ...previousData, ...data});
    }

    get clientPanelRef() {
        return this.clientPanel;
    }

    public setClientPanel(clientPanel: ElementRef) {
        this.clientPanel = clientPanel;
    }
}
