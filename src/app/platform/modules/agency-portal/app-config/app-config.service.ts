import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { AppConfigModel } from './app-config-model';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  saveURL = 'AppConfigurations/UpdateAppConfiguration';
  getAllURL = "AppConfigurations/GetAppConfigurations";

  constructor(private commonService: CommonService) { }

  getAll() {
    let url = this.getAllURL;
    return this.commonService.getAll(url, {});
  }
  save(data: Array<AppConfigModel>) {
    return this.commonService.post(this.saveURL, data);
  }
}
