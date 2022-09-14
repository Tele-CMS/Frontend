import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ClientListingService } from './client-listing.service';
import { ResponseModel } from '../../core/modals/common-model';
import { ClientListingModel } from './client-listing.model';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { CommonService } from '../../core/services';

@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.component.html',
  styleUrls: ['./client-listing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientListingComponent implements OnInit {
 searchKey: string = '';
 active: boolean;
 inActive: boolean;
 toggle: boolean = false;
 locationId: number;
 patientList: Array<ClientListingModel> = [];
 isLoadingClients: boolean;
  loaderImage = '/assets/loader.gif';

  constructor(
    private clientListingService: ClientListingService,
    private commonService: CommonService,
    private route: Router,
    private layoutService: LayoutService
  ) { }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.locationId = user.currentLocationId;
        this.getClients();
      }
    })
  }

  getClients() {
    let status: boolean;
    if (this.active == undefined && this.inActive == undefined) {

    }
    this.isLoadingClients = true;
    this.clientListingService.getPatients(this.searchKey, this.locationId, status)
    .subscribe((response: ResponseModel) => {
      this.isLoadingClients = false;
      if (response != null && response.data != null && response.statusCode == 201)
        this.patientList = response.data.map(x => { x.dob = format(x.dob, 'MM/DD/YYYY'); return x; });
      else
        this.patientList = [];
    });
  }

  onClick(item?: ClientListingModel) {
    this.layoutService.toggleClientDrawer(false);
    if (item)
      this.route.navigate(["web/client/profile"], { queryParams: { id: (item != null ? this.commonService.encryptValue(item.patientId, true) : null) } });
    else
      this.route.navigate(["web/client"], { queryParams: { id: null } });
  }

  toggleAdvancedFilter(toggle?: boolean) {
    this.toggle = toggle != null ? toggle : !this.toggle;
  }
}
