import { Component, OnInit } from '@angular/core';
import { AppConfigModel } from '../app-config-model';
import { AppConfigService } from '../app-config.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-app-configuration',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.css']
})
export class AppConfigurationComponent implements OnInit {
  appConfigData: AppConfigModel[] = [];
  requiredPageSettings: AppConfigModel[] = [];
  requiredSoapSignArray: Array<any> = [];
  constructor(private appConfigService: AppConfigService, private notifier: NotifierService) { }

  ngOnInit() {
    this.getConfiguration();
  }
  getConfiguration() {
    this.appConfigService.getAll().subscribe((response: ResponseModel) => {
      if (response != null) {
        this.appConfigData = response.data;
        this.appConfigData.filter(x => {
          if (x.configType == 1) {
            this.requiredSoapSignArray.push({
              ...x,
              value: (x.value || '').toLowerCase() === 'true'
            })
          } else if (x.configType == 2) {
            this.requiredPageSettings.push({ ...x })
          }
        });
      }
    });
  }
  onSubmit(event: any) {
    this.appConfigService.save(this.appConfigData).subscribe((response: ResponseModel) => {
      if (response != null) {
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message)
        } else {
          this.notifier.notify('error', response.message)
        }

      }
    });
  }
}
