import { Component, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SharedService } from '../shared.service';
import { NavItem, SidebarInfo } from '../models';
import { NotifierService } from 'angular-notifier';
import { ThrowStmt } from '@angular/compiler';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { CommonService } from 'src/app/platform/modules/core/services';
import { LoginUser } from 'src/app/platform/modules/core/modals/loginUser.modal';

@Component({
    selector: 'app-layout-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnChanges {
    @Input() sidebarInfo: SidebarInfo;
    @ViewChild('sidenav') public sidenav: MatSidenav;
    isSideBarOpen= true;
    logoBase64: any;
    isEditable: boolean = false;
    isSuperadmin: boolean = false;
    isLogo = false;

    navItems: NavItem[] = [];
    constructor(private sharedService: SharedService, private notifier: NotifierService, private commonService: CommonService) {
    }

    ngOnChanges(changes) {
        const sidebarInfo = changes.sidebarInfo || null;
        if (sidebarInfo && sidebarInfo.currentValue) {
            this.navItems = sidebarInfo.currentValue.navigations;
        }
    }

    ngOnInit() {
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "ADMIN" || (userRoleName || "").toUpperCase() === "PROVIDER") {
            this.isEditable = true;
          }
        }
        if (localStorage.getItem("super-user-token")) {
          this.isSuperadmin = true;
        }
      });
        this.sharedService.setSidenav(this.sidenav);
        this.addremoveCustomClasses(true);
        if(!this.isSuperadmin)
        this.getOrganizationLogo();
    }

    toggleSidebar(){
        this.isSideBarOpen = ! this.isSideBarOpen;
        this.addremoveCustomClasses(this.isSideBarOpen);
    }

    addremoveCustomClasses(isOpen){

        const elerefSidebar = document.getElementsByClassName('mat-drawer');
        const elerefContent = document.getElementsByClassName('mat-drawer-content');
        const elerefHeader = document.getElementsByClassName('main-header');

        let sidebar = elerefSidebar && elerefSidebar.length > 0 ? elerefSidebar[0] as HTMLElement : null;
        let content = elerefContent && elerefContent.length > 0 ? elerefContent[0] as HTMLElement : null;
        let header = elerefHeader && elerefHeader.length > 0 ? elerefHeader[0] as HTMLElement : null;

        if(isOpen) {
            if(sidebar){
                sidebar.classList.add('custom-nav-sidebar-open')
                sidebar.classList.remove('custom-nav-sidebar-close')
            }
            if(content){
                content.classList.add('custom-draw-content-open')
                content.classList.remove('custom-draw-content-close')
            }
            if(header){
                header.classList.add('custom-header-content-open')
                header.classList.remove('custom-header-content-close')
            }
        } else {
            if(sidebar){
                sidebar.classList.remove('custom-nav-sidebar-open')
                sidebar.classList.add('custom-nav-sidebar-close')
            }
            if(content){
                content.classList.remove('custom-draw-content-open')
                content.classList.add('custom-draw-content-close')
            }
            if(header){
                header.classList.remove('custom-header-content-open')
                header.classList.add('custom-header-content-close')
            }
        }

    }

  handleImageChange(e) {
    if (this.sharedService.isValidFileType(e.target.files[0].name, "image")) {
      let file = e.target.files[0];
      var input = e.target;
      var reader = new FileReader();
      const img = new Image();
       img.src = window.URL.createObjectURL( file );
      reader.onload = () => {
        const width = img.naturalWidth;
         const height = img.naturalHeight;

         window.URL.revokeObjectURL( img.src );

         if( width !== 186 && height !== 35 ) {
            this.notifier.notify('error', "Photo size should be 186 x 35");
            return;
         }
         else{
          this.logoBase64 = reader.result;
          this.onSubmitLogo();
         }

      };
      reader.readAsDataURL(input.files[0]);

    }
    else
      this.notifier.notify('error', "Please select valid file type");
  }

  onSubmitLogo() {
    if (this.logoBase64 == undefined) {
      return;
    }
    //this.submitted = true;

    const formData = {
      LogoBase64: this.logoBase64,
    }

    this.sharedService.saveOrganizationLogo(formData).subscribe((response: any) => {
     // this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }

  getOrganizationLogo() {
    this.sharedService.getOrganizationLogo().subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) { 
        console.log("logo",response.data)
        if(response.data != null && response.data != undefined && response.data != "")
        {
          this.isLogo = true;
          this.logoBase64 = response.data;
        }
       
      }
    });
  }
}
