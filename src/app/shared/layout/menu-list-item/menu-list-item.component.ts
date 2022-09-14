import { StaffExperience } from "src/app/front/doctor-profile/doctor-profile.model";
import { StaffQualification } from "./../../../front/doctor-profile/doctor-profile.model";
import { ProfileSetupModel } from "./../../../platform/modules/core/modals/loginUser.modal";
import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { NavItem } from "../../models/navItem";
import { CommonService } from "src/app/platform/modules/core/services";
import { DialogService } from "../dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";

@Component({
  selector: "app-menu-list-item",
  templateUrl: "./menu-list-item.component.html",
  styleUrls: ["./menu-list-item.component.scss"],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      )
    ])
  ]
})
export class MenuListItemComponent implements OnChanges {
  expanded: boolean = false;
  profileSetup: ProfileSetupModel;
  @HostBinding("attr.aria-expanded") ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(
    public router: Router,
    private _commonService: CommonService,
    private notifier: NotifierService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.profileSetup = new ProfileSetupModel();
  }

  ngOnChanges(changes) {
    const item: NavItem = changes.item.currentValue || {};
    if (item.children && item.children.length) {
      let routeName = this.router.url;
      this.expanded =
        this.item.children.findIndex(x => routeName.includes(x.route)) > -1;
    }
  }

  onItemSelected(item: NavItem) {
    let staffId: number = 0;
    this._commonService.loginUser.subscribe((user: LoginUser) => {
      if (user) {
        staffId = user.data.id;
      }
    });
    let isPatient: boolean = true;
    this._commonService.isPatient.subscribe(res => {
      isPatient = res;
    });
    let userRole: string = "";
    this._commonService.userRole.subscribe(res => {
      userRole = res;
    });
    this._commonService.isProfileComplete.subscribe(res => {
      if (!isPatient && (userRole || "").toUpperCase() == "PROVIDER")
        this.profileSetup = res;
      else this.profileSetup.isProfileSetup = 1;
    });
    if (this.profileSetup.isProfileSetup) {
      if (!item.children || !item.children.length) {
        this.router.navigate([item.route], { queryParams: item.params || {} });
        // this.navService.closeNav();
      }
      if (item.children && item.children.length) {
        this.router.navigate([item.children[0].route], { queryParams: item.children[0].params || {} });
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
          id: this._commonService.encryptValue(staffId)
        }
      });
    }
  }

  isActiveRoute(item: NavItem): boolean {
    // if (!item.route) {
    //   return false;
    // }

    // let routeIndex = this.router.url.indexOf("?"),
    //   isExact = routeIndex > -1 ? false : true;

    // if (item.route == "/web/manage-users/user" || item.route == "/web/client")
    //   isExact = true;

    // return this.router.isActive(item.route, isExact);

    if(!item.route && item.children && item.children.length>0){
        const childItem = item.children.find(x => x.route && x.route == this.router.url);
        return childItem ? true : false;
    } else if(item.route){
      return item.route == this.router.url ? true : false;
    } else {
      return false;
    }

  }

}
