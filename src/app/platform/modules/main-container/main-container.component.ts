import { ProfileSetupModel } from "./../core/modals/loginUser.modal";
import { debug } from "util";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { LoginUser } from "../core/modals/loginUser.modal";
import { MediaMatcher } from "@angular/cdk/layout";
import { HeaderInfo, NavItem, SidebarInfo } from "../../../shared/models";
import { MatSidenav, MatDialog } from "@angular/material";
import { CommonService, LayoutService } from "../core/services";
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  RouterEvent,
} from "@angular/router";
import { ChangePasswordComponent } from "../agency-portal/change-password/change-password.component";
import { userInfo } from "os";
import { HubConnection } from "../../../hubconnection.service";
import { SubDomainService } from "../../../subDomain.service";
import { HubService } from "./hub.service";
import { AppService } from "src/app/app-service.service";
import { filter, map } from "rxjs/operators";
import { NotifierService } from "angular-notifier";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";

@Component({
  selector: "app-main-container",
  templateUrl: "./main-container.component.html",
  styleUrls: ["./main-container.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MainContainerComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav") public sidenav: MatSidenav;
  @ViewChild("clientDrawer") public clientDrawer: MatSidenav;

  private subscription: Subscription;
  private subscriptionClientNavs: Subscription;
  private subscriptionLoading: Subscription;
  logoUrl: string;
  headerInfo: HeaderInfo;
  sidebarInfo: SidebarInfo;
  sidebarInfoALl:SidebarInfo;
  allNavigations: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isOpenClientDrawer: boolean = false;
  loading: boolean = false;
  isPatient: boolean = false;
  loaderImage = "/assets/loader.gif";
  private hubConnection: HubConnection;
  staffId: number = 0;
  fullName:string= '';
  moduleTabs:any;
  selectedTabIndex:any;
  profileSetup: ProfileSetupModel;
  isOpenClientEncoutnerPanel: any;
  constructor(
    public dialogModal: MatDialog,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private hubService: HubService,
    private appService: AppService,
    private notifier: NotifierService,
    private dialogService:DialogService

  ) {
    this.profileSetup = new ProfileSetupModel();
    this.mobileQuery = media.matchMedia("(min-width: 992px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subscription = this.commonService.loginUser.subscribe(

      (user: LoginUser) => {
        if (user.data) {

          this.fullName = user.data.firstName + " "+ user.data.lastName;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT")
          {
            this.fullName = user.patientData.firstName + " "+ user.patientData.lastName;
            this.isPatient = true;
          }

          else
          {
            this.isPatient = false;
          this.fullName = user.data.firstName + " "+ user.data.lastName;
        }
          this.staffId = user.data.id;
          if (!this.isPatient)
            this.commonService.isProfileUpdated(Number(this.staffId));
          this.headerInfo = {
            user: user.data,
            userLocations: user.userLocations || [],
            userNavigations: this.getUserNaviagations(user),
          };
          this.sidebarInfo = {
            navigations: this.getSideNavigations(user),
          };
          this.sidebarInfoALl = this.sidebarInfo;
          if (!this.isPatient) {
            this.allNavigations = this.sidebarInfo;
            this.updateClientRoutes(null, null);
          }
          this.commonService.setIsPatient(this.isPatient);
          this.hubService.createHubConnection(user.data.userID);
          const initialModule = this.extractModuleName(this.router.url)
          if(initialModule){;
            this.filterTabs(initialModule);
          }
        }
      }
    );
  }

  ngOnInit() {
    this.layoutService.setSidenav(this.sidenav);
    this.layoutService.setClientDrawer(this.clientDrawer);

    this.subscriptionLoading = this.commonService.loadingState.subscribe(
      (isloading: boolean) => {
        this.loading = isloading;
      }
    );

    this.subscription = this.subDomainService
      .getSubDomainInfo()
      .subscribe((domainInfo) => {
        if (domainInfo)
          this.logoUrl =
            "data:image/png;base64," + domainInfo.organization.logoBase64;
      });

    this.subscriptionClientNavs = this.commonService.updateClientNavigation.subscribe(
      (clientInfo) => {
        const { clientId, userId } = clientInfo;
        this.updateClientRoutes(clientId, userId);
      }
    );
    var asyncLoadCount = 0;
    this.redirectToDashboard(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.redirectToDashboard(event.url);

        // on route change toggle sidebar...
        if (window.innerWidth < 991) this.layoutService.toggleSideNav(false);
      }
      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--;
      }
      this.loading = !!asyncLoadCount;
    });



    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((res: RouterEvent) => {

        const module = this.extractModuleName(res.url);
        this.filterTabs(module);
       });
       // added by Shubham i.e on 09/11/2021
       this.layoutService.clientDrawerData.subscribe(({ changedState, encounterId, firstTimeSaved }) => {
        this.isOpenClientEncoutnerPanel = changedState;
      });

       this.commonService.chatNavigationData.subscribe(({ patientId }) => {

        if (patientId) {
          if (this.isOpenClientEncoutnerPanel) {
            const encryptId = this.activatedRoute.snapshot.queryParamMap.get('id');
            const pid = encryptId && this.commonService.encryptValue(encryptId, false);
            if (pid != patientId) {
              this.onConfirmDiscardEncounter(patientId);
            }
          } else {
            const encId = this.commonService.encryptValue(patientId, true);
            this.router.navigate(["/web/client/profile"], { queryParams: { id: encId } });
          }
        }
      });
      /// added by Shubham i.e on 09/11/2021
  }
  // added by Shubham i.e on 09/11/2021
  onConfirmDiscardEncounter(patientId: number) {
    this.dialogService.confirm('Are you sure you want to discard the current encounter changes?')
      .subscribe((result: any) => {
        if (result == true) {
          this.layoutService.changeClientDrawerData(false, {});
          const encId = this.commonService.encryptValue(patientId, true);
          this.router.navigate(["/web/client/profile"], { queryParams: { id: encId } });
        }
      });
  }
  /// added by Shubham i.e on 09/11/2021

  extractModuleName(url): string{

    url = url.replace('/web/','');
    const index = url.indexOf('/');
    if(index != -1){
      url = url.slice(0,index);
     return url;
    } else {return url ;}
  }
  filterTabs(module:string){
    if(module){

        const moduleWithNoChildren = this.sidebarInfo.navigations.find(x => {
          if(x.route){
            const r = this.extractModuleName(x.route);
            return r == module ? true : false;
          }  else { return false;}

        });
        if(moduleWithNoChildren){
          this.moduleTabs = [];
        } else {
          const modulesWithChildren = this.sidebarInfo.navigations.filter(x => x.children && x.children.length >0);
          if(modulesWithChildren && modulesWithChildren.length>0){
            const selectedModules = modulesWithChildren.filter(x => {
             let r = this.extractModuleName(x.children[0].route);
             return r == module ? true : false;
            });
            if(selectedModules && selectedModules.length >0)
            {
              const selectedModule = selectedModules[0];
              if(selectedModule.children) {
                this.moduleTabs = selectedModule.children;
              let currentUrl = this.router.url;
              const indexPrm = currentUrl.indexOf('?');
              if(indexPrm != -1){
                currentUrl =currentUrl.slice(0,indexPrm);
              }
              if(this.moduleTabs && this.moduleTabs.length){
                const currentTabIndex = this.moduleTabs.findIndex(x => x.route && x.route == currentUrl);
                if(currentTabIndex != -1){
                  this.selectedTabIndex = currentTabIndex;
                }
              }
            }
              else
              this.moduleTabs = [];
            }
            else
            this.moduleTabs = [];
          }
          else
          this.moduleTabs = [];
        }
            }
            else
            this.moduleTabs = [];

  }

  isActiveTab(tab): boolean {
    let currentlUrl = this.router.url;
    return tab.route && tab.route == currentlUrl ? true : false;
  }

  onItemSelected(item: NavItem) {

    let staffId: number = 0;
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user) {
        staffId = user.data.id;
      }
    });
    let isPatient: boolean = true;
    this.commonService.isPatient.subscribe(res => {
      isPatient = res;
    });
    let userRole: string = "";
    this.commonService.userRole.subscribe(res => {
      userRole = res;
    });
    this.commonService.isProfileComplete.subscribe(res => {
      if (!isPatient && (userRole || "").toUpperCase() == "PROVIDER")
        this.profileSetup = res;
      else this.profileSetup.isProfileSetup = 1;
    });
    if (this.profileSetup.isProfileSetup) {
      if (!item.children || !item.children.length) {
        this.router.navigate([item.route], { queryParams: item.params || {} });
        this.changeDetectorRef.detectChanges();
        // this.navService.closeNav();
      }
      if (item.children && item.children.length) {
       // this.expanded = !this.expanded;
      }
    } else {
      this.notifier.hideAll();
      if (this.profileSetup == undefined || this.profileSetup == null)
        this.profileSetup = new ProfileSetupModel();
      if (this.profileSetup.basicProfile == 0)
        this.notifier.notify(
          "error",
          "Your Basic Profile Not Completed, Please Complete Your Profile First..!!"
        );
      else if (this.profileSetup.staffServices == 0)
        this.notifier.notify(
          "error",
          "Services Not Added, Please Add Services First..!!"
        );
      else if (this.profileSetup.staffTaxonomies == 0)
        this.notifier.notify(
          "error",
          "Taxonmoies Not Added, Please Add Taxonmoies First..!!"
        );
      else if (this.profileSetup.staffSpecialities == 0)
        this.notifier.notify(
          "error",
          "Specialities Not Added, Please Add Specialities First..!!"
        );
      else if (this.profileSetup.staffAvailability == 0)
        this.notifier.notify(
          "error",
          "Availability Not Found, Please Add Availability First..!!"
        );
      else if (this.profileSetup.staffExperiences == 0)
        this.notifier.notify(
          "error",
          "Experience Not Added, Please Add Experience First..!!"
        );
      else if (this.profileSetup.staffQualifications == 0)
        this.notifier.notify(
          "error",
          "Qualification Not Added, Please Add Qualification First..!!"
        );
      else if (this.profileSetup.staffAwards == 0)
        this.notifier.notify(
          "error",
          "Awards Not Added, Please Add Awards First..!!"
        );

      this.router.navigate(["/web/manage-users/user"], {
        queryParams: {
          id: this.commonService.encryptValue(staffId)
        }
      });
    }
  }

  redirectToDashboard(url: string) {
    let ProfileSetup: ProfileSetupModel = new ProfileSetupModel();
    let userRole: string = "";
    this.commonService.userRole.subscribe((res) => {
      userRole = res;
    });
    if (!this.isPatient) {
      //
      if ((userRole || "").toUpperCase() == "PROVIDER") {
        this.commonService.getProfileUpdated(this.staffId).subscribe((res) => {
          //this.commonService.isProfileComplete.subscribe(res => {
          if (res.statusCode == 200) {
            ProfileSetup = res.data;
          }
          //ProfileSetup = res;
          this.commonService.setIsProfileComplete(ProfileSetup);
          if (!ProfileSetup.isProfileSetup)
            this.router.navigate(["/web/manage-users/user"], {
              queryParams: {
                id: this.commonService.encryptValue(this.staffId),
              },
            });
          else {
            if (url == "/web/dashboard" || url == "/web") {
              this.router.navigate(["/web/dashboard"]);
            }
          }
        });
      } else {
        if (url == "/web/dashboard" || url == "/web") {
          this.router.navigate(["/web/dashboard"]);
        }
      }
      //}
    } else {
      if (url == "/web/client/dashboard" || url == "/web") {
        this.router.navigate(["/web/client/dashboard"]);
      }
    }

    // this.commonService.isProfileComplete.subscribe(
    //   (isProfileComplete: boolean) => {
    //     if (!this.isPatient && !isProfileComplete)
    //       this.router.navigate(["/web/manage-users/user"], {
    //         queryParams: {
    //           id: this.commonService.encryptValue(this.staffId)
    //         }
    //       });
    //     else {
    //       if (url == "/web") {
    //         const redirectUrl = this.isPatient
    //           ? "/web/client/dashboard"
    //           : "/web/dashboard";
    //         this.router.navigate([redirectUrl]);
    //       }
    //     }
    //   }
    // );
  }

  createConnection(user: LoginUser) {
    this.hubConnection = new HubConnection();
    this.hubConnection.createHubConnection(user.access_token);
    //Hub Connection setting ......
    let userId = user.data && user.data.userID;
    let self = this;
    if (this.hubConnection.isConnected()) {
      this.hubConnection.getHubConnection().onclose(() => {
        this.ReconnectOnClose(userId);
      });
      this.hubConnection.ConnectToServerWithUserId(userId, 1).then((res) => {
        // console.log('Connection: user id sent to server : ' + userId);
        self.getMessageNotifications();
      });
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(userId);
        });
        this.hubConnection.ConnectToServerWithUserId(userId, 1).then(() => {
          // console.log('Restart Connection: user id sent to server : ' + userId);
          self.getMessageNotifications();
        });
      });
    }
  }
  ReconnectOnClose(userId) {
    setTimeout(() => {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.ConnectToServerWithUserId(userId, 1).then(() => {
          // console.log('Restart Connection: user id sent to server : ' + userId);
        });
      });
    }, 5000);
  }

  getMessageNotifications() {
    this.hubConnection
      .getHubConnection()
      .on("NotificationResponse", (response) => {
        console.log("message from server", response);
      });
  }
  updateClientRoutes(clientId: number, userId: number = null) {

    const navs: SidebarInfo = this.allNavigations;
    const clientIndex =
      navs &&
      navs.navigations.findIndex((obj) => obj.displayName === "Manage Client");
    if (clientIndex > -1) {
      const clientChildrens = navs.navigations[clientIndex].children;
      let updateClientChildrens = [];
      clientChildrens.forEach((item) => {
        if (item.route.includes("/web/client") && clientId) {
          if (item.route != "/web/client")
            item.params = {
              id: this.commonService.encryptValue(clientId, true),
            };

          // for client documents changes
          if (item.route == "/web/client/documents" && userId) {
            item.params = {
              ...item.params,
              uid: this.commonService.encryptValue(userId, true),
            };
          }
          if(item.route != "/web/client"){
            updateClientChildrens.push(item);
          }


        } else if (item.route == "/web/client" && !clientId) {
          updateClientChildrens.push(item);
        }
      });

      let updatedNavs: SidebarInfo = { navigations: [] };

      navs.navigations.forEach((navObj) => {
        if (navObj.displayName === "Manage Client") {
          updatedNavs.navigations.push({
            ...navObj,
            children: updateClientChildrens,
          });
        } else {
          updatedNavs.navigations.push(navObj);
        }
      });
      this.sidebarInfo = Object.assign({}, updatedNavs);
      this.sidebarInfoALl = this.sidebarInfo;
       const initialModule = this.extractModuleName(this.router.url)
    if(initialModule){
      this.filterTabs(initialModule);
    }
    }

      const cIndex =
      navs &&
      navs.navigations.findIndex((obj) => obj.displayName === "Encounters");
    if (cIndex > -1) {
      let updatedNavs1: SidebarInfo = { navigations: [] };
      navs.navigations.forEach((navObj) => {

        if (navObj.route == "/web/selection" && userId) {
          navObj.params = {
            id: this.commonService.encryptValue(clientId, true),
          };
        }

        if (navObj.displayName === "Encounters") {
          updatedNavs1.navigations.push({
            ...navObj,
          });
        } else {
          updatedNavs1.navigations.push(navObj);
        }
      });
      this.sidebarInfo = Object.assign({}, updatedNavs1);
      this.sidebarInfoALl = this.sidebarInfo;
    }
  }

  onClientToggle(sidenav: MatSidenav) {
    this.isOpenClientDrawer = !sidenav.opened;
    sidenav.toggle();
  }
  createModal() {
    let chnagePasswordModal;
    chnagePasswordModal = this.dialogModal.open(ChangePasswordComponent, {
      hasBackdrop: true,
      data: {},
    });
  }

  getUserNaviagations(user: LoginUser) {
    let navigations: NavItem[] = [];
    const userRoleName =
      user.data.users3 && user.data.users3.userRoles.userType;
    if ((userRoleName || "").toUpperCase() === "ADMIN") {
      navigations = [
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/manage-users/user-profile",
        },
        {
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },
        {
          displayName: "Settings",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/app-config",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } else if (
      (userRoleName || "").toUpperCase() === "STAFF" ||
      (userRoleName || "").toUpperCase() === "PROVIDER"
    ) {
      navigations = [
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/manage-users/user-profile",
        },
        {
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } else if ((userRoleName || "").toUpperCase() === "CLIENT") {
      navigations = [
        {
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    }

    return navigations;
  }

  getSideNavigations(user: LoginUser) {
    let navigations: NavItem[] = [];
    const userRoleName =
      user.data.users3 && user.data.users3.userRoles.userType;
    if ((userRoleName || "").toUpperCase() === "CLIENT") {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/client/dashboard",
        },
        {
          displayName: "My Appointments",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/client/my-scheduling",
        },

        // {
        //   displayName: "Waiting room",
        //   iconName: '<i class="la la-paste"></i>',
        //   route: "/web/client/waiting-room",
        // },

        {
          displayName: "Vitals",
          iconName: '<i class="la la-heartbeat"></i>',
          route: "/web/client/my-vitals",
        },
        {
          displayName:"History",
          iconName: '<i class="la la-history"></i>',
          route: "/web/client/history/my-family-history",
          // children:[
          //   {
          //     displayName: "Family history",
          //     iconName: '<i class="la la-users"></i>',
          //     route: "/web/client/history/my-family-history",
          //   },
          //   {
          //     displayName: "Social history",
          //     iconName: '<i class="la la-share-alt"></i>',
          //     route: "/web/client/history/my-social-history",
          //   },
          // ],
        },
        {
          displayName: "Documents",
          iconName: '<i class="la la-file-text-o"></i>',
          route: "/web/client/my-documents",
        },
        {
          displayName: "My Diagnosis",
          iconName: '<i class="la la-medkit"></i>',
          route: "/web/client/my-diagnosis",
        },
        // {
        //     displayName:"My Medications",
        //     iconName: '<i class="material-icons">note_add</i>',
        //     route: "/web/client/my-medications/current",
            // children:[
            //   {
            //     displayName: "Current Medications",
            //     iconName: '<i class="la la-file-text-o"></i>',
            //     route: "/web/client/my-medications/current",
            //   },
            //   {
            //     displayName: "Claims Medications",
            //     iconName: '<i class="la la-file-text-o"></i>',
            //     route: "/web/client/my-medications/claim",
            //   }
            // ]
        // },
        {
          displayName:"My Medications",
          iconName: '<i class="material-icons">note_add</i>',
          route: "/web/client/my-medications",
        },
        {
          displayName: "My Programs",
          iconName: '<i class="la la-tasks"></i>',
          route: "/web/client/my-programs",
        },
        {
          displayName: "My Encounters",
          iconName: '<i class="zmdi zmdi-file-text"></i>',
          route: "/web/client/my-encounters",
        },
        {
          displayName: "My Assessments",
          iconName: '<i class="la la-question-circle"></i>',
          route: "/web/client/my-assessments",
        },
        // {
        //   displayName: "My Health Score",
        //   iconName: '<i class="la la-check"></i>',
        //   route: "/web/client/health-e-score",
        // },
        {
          displayName: "My Care Management",
          iconName: '<i class="la la-comments"></i>',
          route: "/web/client/chat",
        },

        //commented for now not in scope
        // {
        //   displayName:"Payment",
        //   iconName: '<i class="la la-dollar"></i>',
        //   route: "/web/client/payment/payment-history",
        //   // children:[
        //   //   {
        //   //     displayName: "Payments",
        //   //     iconName: '<i class="la la-dollar"></i>',
        //   //     route: "/web/client/payment/payment-history",
        //   //   },
        //   //   {
        //   //     displayName: "Refunds",
        //   //     iconName: '<i class="la la-dollar"></i>',
        //   //     route: "/web/client/payment/refund-history",
        //   //   }
        //   // ]
        // },
        // {
        //   displayName: "Mailbox",
        //   iconName: '<i class="la la-envelope-o"></i>',
        //   route: "/web/client/mailbox",
        // },
        {
          displayName: "My profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/client/my-profile",
        },
        {
          displayName: "Onboarding",
          iconName: '<i class="la la-book"></i>',
          route: "/web/client/onboarding",
        },
        // {
        //   displayName: "Assign Questionnaire",
        //   iconName: '<i class="la la-file-text-o"></i>',
        //   route: "/web/client/assigned-documents",
        // },
      ];
    } else if (user.userPermission) {
      let modules = user.userPermission.modulePermissions || [];
      const screens = user.userPermission.screenPermissions || [],
        // modules which has the permission true
      //   isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN" || (userRoleName || "").toUpperCase() === "PROVIDER";
         isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN";
        //isAdminLogin = (userRoleName || "").toUpperCase() === "PROVIDER";
      modules = modules.filter((obj) => obj.permission || isAdminLogin);
      //modules = modules.filter((obj) => obj.moduleName!="Manage Users");
      // modules = modules.filter((obj) => obj.moduleName!="Reports");   //agencyremove
      //modules = modules.filter((obj) => obj.moduleName!="Questionnaire");

      navigations = modules.map((moduleObj) => {
        // screens which has the permission true
        const moduleScreens = screens.filter(
          (obj) =>
            obj.moduleId === moduleObj.moduleId &&
            (obj.permission || isAdminLogin)
        );
        // moduleScreens== screens.filter(
        //   (obj) =>obj.screenKey!="MASTERS_APPOINTMENTTYPES_LIST"
        // );

        let nestedScreens: { route?: string; children?: any } = {
          route: `/web${moduleObj.navigationLink}`,
        };
        if (!moduleObj.navigationLink) {
          nestedScreens = {
            children: moduleScreens.map((screenObj) => {
              // routing changes due to some conditions ....

              let appendRoute = "";
              if (
                moduleObj.moduleName == "Masters" ||
                moduleObj.moduleName == "Billing" ||
                moduleObj.moduleName == "Logs"
              )
                appendRoute = `/${moduleObj.moduleName}`;
              if (moduleObj.moduleName == "Manage Users")
                appendRoute = "/manage-users";
              if (moduleObj.moduleName == "Payments") appendRoute = "/payment";

              const screenNavigation = `/web${appendRoute}${screenObj.navigationLink}`;
              return {
                displayName: screenObj.screenName,
                iconName: "",
                route: screenNavigation,
              };
            }),
          };
        }
        return {
          displayName: moduleObj.moduleName,
          iconName: moduleObj.moduleIcon,
          ...nestedScreens,
        };
      });
    }

    return navigations;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionLoading.unsubscribe();
    this.subscriptionClientNavs.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  get isDashboardScreen():boolean{
    return this.router.url.includes('dashboard') ? true : false;
  }

  onTabChange(selectedTabIndex){
      const tab = this.moduleTabs[selectedTabIndex];
      this.onItemSelected(tab);
  }
}
