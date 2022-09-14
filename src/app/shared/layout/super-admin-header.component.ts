import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';

import { SharedService } from '../shared.service';
import { HeaderInfo, NavItem } from '../models';
import { Router } from '@angular/router';
import { CommonService } from '../../super-admin-portal/core/services';

@Component({
    selector: 'app-layout-super-admin-header',
    templateUrl: 'super-admin-header.component.html',
    styleUrls: ['./super-admin-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SuperAdminHeaderComponent implements OnInit, OnChanges {
    @Input() headerInfo: HeaderInfo;
    userInfo: any = {};
    userNavigations: NavItem[] = [];

    constructor(private sharedService: SharedService, private commonService: CommonService, private router: Router) { }

    ngOnChanges(changes) {
        const headerInfo = changes.headerInfo || null;
        if (headerInfo && headerInfo.currentValue) {
            this.userInfo = headerInfo.currentValue.user;
            this.userNavigations = headerInfo.currentValue.userNavigations;
        }
    }

    onSelectUserMenu(item: NavItem) {
        switch (item.route) {
            case '/webadmin/sign-out':
                this.commonService.logout();
                this.router.navigate(['/webadmin']);
                location.reload();
                break;
            default:
                break;
        }
    }

    ngOnInit() {
    }

    toggleSidenav() {
        this.sharedService.toggle();
    }
}
