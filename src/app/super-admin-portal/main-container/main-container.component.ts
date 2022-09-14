import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginUser } from '../core/modals/loginUser.modal';
import { MediaMatcher } from '@angular/cdk/layout';
import { HeaderInfo, NavItem, SidebarInfo } from '../../shared/models';
import { CommonService } from '../core/services';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainContainerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  headerInfo: HeaderInfo;
  sidebarInfo: SidebarInfo;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private commonService: CommonService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.headerInfo = {
          user: user.data,
          userNavigations: this.getUserNaviagations(user),
        };
        this.sidebarInfo = {
          navigations: this.getSideNavigations(user),
        };
      } else {
        const tempUser: LoginUser = {
          access_token: '',
          appConfigurations: [],
          data: { roleName: 'superadmin' },
          expires_in: null,
          firstTimeLogin: false,
          notifications: {},
          passwordExpiryStatus: {},
          statusCode: null,
          userLocations: [],
          userPermission: {},
        }
        this.headerInfo = {
          user: tempUser,
          userNavigations: this.getUserNaviagations(tempUser),
        };
        this.sidebarInfo = {
          navigations: this.getSideNavigations(tempUser),
        };
      }
    });
  }

  getUserNaviagations(user: LoginUser) {
    let navigations: NavItem[] = [];
    const userRoleName = user.data.roleName;
    if ((userRoleName || '').toUpperCase() === 'SUPERADMIN') {
      navigations = [
        { displayName: 'Sign Out', iconName: '<i class="la la-power-off"></i>', route: '/webadmin/sign-out' }];
    }

    return navigations;
  }

  getSideNavigations(user: LoginUser) {
    let navigations: NavItem[] = [];

    const userRoleName = user.data.roleName;
    if ((userRoleName || '').toUpperCase() === 'SUPERADMIN') {
      navigations = [{ displayName: 'Dashboard', iconName: '<i class="la la-cog"></i>', route: '/webadmin/dashboard' },
      { displayName: 'Manage Agency', iconName: '<i class="la la-users"></i>', route: '/webadmin/agency' },
      { displayName: 'Manage Database', iconName: '<i class="la la-database"></i>', route: '/webadmin/manage-database' },
      ];
    }

    return navigations;
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
