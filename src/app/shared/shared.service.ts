import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { CommonService } from '../platform/modules/core/services';

@Injectable()
export class SharedService {
  getOrganizationLogoURL = "api/Organization/GetOrganizationLogo";
  saveOrganizationLogoURL = "api/Organization/ChangeOrganizationLogo";
  createThemeSettingURL = "/CreateSetting";
  getThemeSettingURL = "/GetSettings";

    private sidenav: MatSidenav;

    constructor(private commonService: CommonService) { }

    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
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

   isValidFileType(fileName, fileType): boolean {
    // Create an object for all extension lists
    let extentionLists = { video: [], image: [], pdf: [], excel: [], xml: [] };
    let isValidType = false;
    extentionLists.video = ["m4v", "avi", "mpg", "mp4"];
    extentionLists.image = ["jpg", "jpeg", "bmp", "png", "ico"];
    extentionLists.pdf = ["pdf"];
    extentionLists.excel = ["excel"];
    extentionLists.xml = ["xml"];
    //get the extension of the selected file.
    let fileExtension = fileName
      .split(".")
      .pop()
      .toLowerCase();
    isValidType = extentionLists[fileType].indexOf(fileExtension) > -1;
    return isValidType;
  }

  saveOrganizationLogo(data: any){
    return this.commonService.post(this.saveOrganizationLogoURL, data);

  }

  getOrganizationLogo(){
    return this.commonService.get(this.getOrganizationLogoURL);
  }

  changeThemeSettings(data:any){
    return this.commonService.post(this.createThemeSettingURL,data);
  }

  getThemeSettings(userId:number){
    return this.commonService.get(this.getThemeSettingURL + '?userId=' + userId);
  }

}
