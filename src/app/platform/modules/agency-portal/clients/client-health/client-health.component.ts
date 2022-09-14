import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterContentChecked, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NavItem } from '../../../../../shared/models/navItem';
import { CommonService, LayoutService } from '../../../core/services';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
// import { ChatHistoryModel } from '../../../../../shared/chat-widget/chat-history.model'; 
import * as moment from 'moment';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { format } from 'date-fns';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-client-health',
  templateUrl: './client-health.component.html',
  styleUrls: ['./client-health.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientHealthComponent implements OnInit, OnDestroy, AfterContentChecked {
  //chat
  loginUserId: number;
  clientUserId: number;
  name: string;
  photoThumbnailPath: string;
  // chatHistoryData: Array<ChatHistoryModel> = [];
  chatHistoryMeta: any;
  chatPermission: boolean
  //chat
  subscription: Subscription;
  subscriptionClient: Subscription;
  navLinks: Array<NavItem>;
  clientId: number;
  encodeClientId: string;
  selectedIndex: number;
  currentRouteName: string;
  isShowCreateEncounter: boolean;
  @ViewChild("clientMainPanel") clientPanel: ElementRef;
  staticClinicalHistorytab: NavItem;
  staticClinicalSummarytab: NavItem;
  staticMedicationtab: NavItem;

  isMediaSM: boolean;
  isMediaMD: boolean;
  isMediaLG: boolean;
  isClientDetailsRoute: boolean;
  firstTimeSavedEncounter: boolean;
  isClientEncounter: boolean;
  isClientProfileInfos: boolean;
  currentEncounterId: number;
  header:String = "Manage Patient";
  constructor(
    private commonService: CommonService,
    private layoutService: LayoutService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private dialogService: DialogService,
    private ref:ChangeDetectorRef
    ) {
    this.navLinks = [];
    this.isShowCreateEncounter = false;
    this.isClientEncounter = false;
    this.isClientProfileInfos = false;
    let routeName = this.router.url;
    this.onActiveRoute(routeName);

  }

  onActiveRoute(routeName: string) {
    let paramsIndex = routeName.indexOf('?');
    this.currentRouteName = routeName.substring(0, paramsIndex != -1 ? paramsIndex : routeName.length);
    this.isClientDetailsRoute = this.currentRouteName.includes('/web/client/details');
    if (this.isClientDetailsRoute) {
      return;
    }
    let routeIndex = this.navLinks.findIndex(x => this.currentRouteName.includes(x.route));
    if (this.currentRouteName.includes('/web/client/history')) {
      routeIndex = this.navLinks.findIndex(x => x.displayName == 'Medical History');
    } else if (this.currentRouteName.includes('/web/client/clinical-summary')) {
      routeIndex = this.navLinks.findIndex(x => x.displayName == 'Clinical Summary');
    }
    this.selectedIndex = routeIndex > -1 ? routeIndex : 0;
  }

  ngAfterContentChecked(): void {
    const perValue = (this.clientPanel.nativeElement.offsetWidth * 100) / document.documentElement.clientWidth;
    this.isMediaSM = perValue < 35;
    this.isMediaMD = perValue > 35 && perValue < 50;
    this.isMediaLG = perValue > 45;
  }

  ngOnInit() { 
    
    this.getUserPermissions();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((val) => {
    
     
      if (val instanceof NavigationEnd) {
        this.onActiveRoute(val.url);
      }
      this.activatedRoute.queryParams.subscribe(params => {
      
        if(this.router.url.includes("/web/client/encounter") && params.id){
          this.isClientEncounter = true;
          this.header = "Patient Encounters"; 
        }else{
          this.isClientEncounter = false; 
        }
         
         
      });
    });
    this.activatedRoute.queryParams.subscribe(params => {
      
      if(this.router.url.includes("/web/client/encounter") && params.id){
        
        this.isClientEncounter = true;
        this.header = "Patient Encounters"; 
      }else{
        this.isClientEncounter = false; 
      }
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      this.encodeClientId = params.id;
       
    });

    this.subscriptionClient = this.commonService.updateClientNavigation.subscribe(clientInfo => {
     
      const { userId, photoThumbnailPath, name } = clientInfo;
      if (userId > 0 && this.loginUserId > 0 && this.clientUserId != userId) {
        this.clientUserId = userId;
        this.name = name, this.photoThumbnailPath = photoThumbnailPath;
        this.getChatHistory();
      }
    });

    //chat
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.loginUserId = user.userID;
      }
    })
    // this.chatHistoryData = [];
    this.chatHistoryMeta = {};
    //chat
    // close the side menu
    this.layoutService.setClientPanel(this.clientPanel);

    // To reset app filters and Client drawer on initial member tabs load.
    this.layoutService.changeClientDrawerData(false, {});
    this.layoutService.updateAppFiltersData({
      EncounterFilters: null
    })

    this.layoutService.clientDrawerData.subscribe(({ changedState, encounterId, firstTimeSaved }) => {
       
      this.isShowCreateEncounter = changedState;
      this.firstTimeSavedEncounter = firstTimeSaved;
      this.currentEncounterId = encounterId;
    });

    this.subscription = this.commonService.loginUser.subscribe((user: any) => {
      if (user.data) {
        let tempLinks = [];
        const userRoleName = user.data.users3 && user.data.users3.userRoles.userType,
          isAdminLogin = (userRoleName || '').toUpperCase() === 'ADMIN';
        const memberModule = (user.userPermission.modulePermissions || []).find(obj => (obj.moduleName || '').toUpperCase() === 'MEMBERS');;
        let memberHealthScreens = (user.userPermission.screenPermissions || []).filter(obj => obj.moduleId == (memberModule && memberModule.moduleId) && (obj.navigationLink || '').includes('/member') && !(obj.navigationLink || '').includes('/client/history') && !(obj.navigationLink || '').includes('/client/clinical-summary') && !(obj.navigationLink || '').includes('/client/medication') && obj.screenKey != 'CLIENT_ADD');

        let clinicalSummaryPermissionScreens = (user.userPermission.screenPermissions || []).filter(obj => obj.moduleId == (memberModule && memberModule.moduleId) && (obj.navigationLink || '').includes('/client/clinical-summary') && obj.screenKey != 'CLIENT_ADD');
        let historyPermissionScreens = (user.userPermission.screenPermissions || []).filter(obj => obj.moduleId == (memberModule && memberModule.moduleId) && (obj.navigationLink || '').includes('/member') && (obj.navigationLink || '').includes('/client/history') && obj.screenKey != 'CLIENT_ADD');
        memberHealthScreens = memberHealthScreens.filter(obj => obj.permission || isAdminLogin);
        clinicalSummaryPermissionScreens = clinicalSummaryPermissionScreens.filter(obj => obj.permission || isAdminLogin);
        historyPermissionScreens = historyPermissionScreens.filter(obj => obj.permission || isAdminLogin);
        memberHealthScreens.sort((a, b) => a.displayOrder - b.displayOrder).forEach(item => {
          let navItem: NavItem = {
            iconName: '',
            displayName: item.screenName,
            // key: item.screenKey,
            route: `/web${item.navigationLink}`,
          }
          tempLinks.push(navItem);
        });

        let profileIndex = tempLinks.findIndex(x => x.key == 'CLIENT_ALERTS');
        if(profileIndex == -1) {
          profileIndex = tempLinks.findIndex(x => x.key == 'CLIENT_PROFILE');
        }
          if (clinicalSummaryPermissionScreens && clinicalSummaryPermissionScreens.length > 0) {
            let navigationLink = clinicalSummaryPermissionScreens[0].navigationLink
            this.staticClinicalSummarytab = {
              iconName: '',
              displayName: 'Clinical Summary',
              route: `/web${navigationLink}`,
            };
            tempLinks.splice(profileIndex + 1, 0, this.staticClinicalSummarytab)
          }
          if (historyPermissionScreens && historyPermissionScreens.length > 0) {
            let navigationLink = historyPermissionScreens[0].navigationLink
            this.staticClinicalHistorytab = {
              iconName: '',
              displayName: 'Medical History',
              route: `/web${navigationLink}`,
            };
            tempLinks.splice(profileIndex + 2, 0, this.staticClinicalHistorytab)
          }
        this.navLinks = tempLinks;
        this.onActiveRoute(this.currentRouteName);
      }
    });
  }

  loadComponent(event: any) {
    if (this.selectedIndex == event.index) {
      return false;
    }

    const screenName = event.tab.textLabel,
      routeName = this.navLinks.find(x => x.displayName == screenName).route;

    this.selectedIndex = this.navLinks.findIndex(x => x.displayName == screenName);

    this.router.navigate([routeName], { queryParams: { id: this.encodeClientId } });
  }

  //chat
  getChatHistory(pageNo: number = 1, pageSize: number = 20) {

    // this.clientsService.getChatHistory(this.loginUserId, this.clientUserId, pageNo, pageSize).subscribe((response: any) => {
    //   if (response != null && response.statusCode == 200) {
    //     if (response.data != null && response.data.length > 0) {

    //       let oldArray = [];
    //       if (pageNo > 1) {
    //         oldArray = this.chatHistoryData.length ? this.chatHistoryData : [];
    //       }
         
    //       this.chatHistoryData = [...response.data, ...oldArray];

    //       this.chatHistoryData.forEach((x) => {
    //         //x.chatDate = moment.utc(x.chatDate).local().format('YYYY-MM-DDTHH:mm:ss');
    //         x.chatDateForWebApp = format(x.chatDateForWebApp, 'YYYY-MM-DDTHH:mm:ss');//moment.utc(x.chatDate).local().format('YYYY-MM-DDTHH:mm:ss');
    //       })
    //       this.chatHistoryData.sort((a, b) => a.id - b.id)
    //     }
    //     this.chatHistoryMeta = response.data != null && response.meta ? response.meta : {};
    //   }
    // });
  }

  onLoadEarlierMessages(event: any) {
    const { pageNo } = event;
    this.getChatHistory(pageNo || 1);
  }

  onReceiveNotification(event: any) {
    // this.commonService.updateHeaderNotifications(event);
  }

  ngOnDestroy(): void {
    // To reset app filters and Client drawer on initial member tabs load.
    this.layoutService.changeClientDrawerData(false, {});
    this.layoutService.updateAppFiltersData({
      EncounterFilters: null
    })

    // re-open the side menu
    this.layoutService.open();
    this.subscription.unsubscribe();
    this.subscriptionClient.unsubscribe();
  }


  onCloseCreateEncounterForm(): Observable<boolean> {
    return this.dialogService.confirm('Are you sure you want to discard the current encounter changes?')
    .pipe(map((result: any) => {
        if (result == true) {
          if (this.currentEncounterId && this.firstTimeSavedEncounter)
            this.clientsService.discardEncounterChanges(this.currentEncounterId).subscribe();
          this.layoutService.changeClientDrawerData(false, {});
          return true;
        } else {
          return false;
        }
      }));
  }


  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_CHAT');
    const { CLIENT_CHAT_SHOW } = actionPermissions;
    this.chatPermission = CLIENT_CHAT_SHOW || false;
  }

}
