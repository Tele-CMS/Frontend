import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ResponseModel } from '../../core/modals/common-model';
import { format } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router'; 
import { CommonService } from '../../core/services';
import { ClientListingService } from '../client-listing/client-listing.service'; 

@Component({
  selector: 'app-client-select',
  templateUrl: './client-select.component.html',
  styleUrls: ['./client-select.component.css'],
  providers: []
  //encapsulation: ViewEncapsulation.None
})
export class ClientSelectComponent implements OnInit {
 searchKey: string = '';
 active: boolean;
 inActive: boolean;
 toggle: boolean = false;
 locationId: number;
 isLoadingClients: boolean;
  loaderImage = '/assets/loader.gif';
  patientList: any;
  clientId: any;
  isActive: boolean = false;
  activeIndex = null;

  constructor(
    private clientListingService: ClientListingService,
    private commonService: CommonService,
    private route: Router,
    //private selectionList: MatSelectionList,
    private activatedRoute: ActivatedRoute,
  ) {
    //this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      if(this.clientId)
      this.onClickNext();
    });
  }

  ngOnInit() {
    if(!this.clientId){

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.locationId = user.currentLocationId;
        this.getClients();
      }
    });
  }

  }



  getClients() {
    let status: boolean;
    if (this.active == undefined && this.inActive == undefined) {

    }
    this.commonService.loadingStateSubject.next(true);
    this.clientListingService.getPatients(this.searchKey, this.locationId, status)
    .subscribe((response: ResponseModel) => {
      if (response != null && response.data != null && response.statusCode == 201)
        this.patientList = response.data.map(x => { x.dob = format(x.dob, 'MM/DD/YYYY'); return x; });
      else
        this.patientList = [];
        this.commonService.loadingStateSubject.next(false);
    });
  }

  onClick(index : any, item?: any) {
    if (item)
this.clientId =item.patientId;
// this.isActive = true;
this.activeIndex = index;
    //   this.route.navigate(["web/client/profile"], { queryParams: { id: (item != null ? this.commonService.encryptValue(item.patientId, true) : null) } });
    // else
    //   this.route.navigate(["web/client"], { queryParams: { id: null } });
  }

  onClickNext(){
    this.route.navigate(["/web/client/encounter"], { queryParams: { id: this.clientId > 0 ? this.commonService.encryptValue(this.clientId, true) : null  } });
  }

  handlePatientEncounterRedirection(id:number){
    console.log("id ",id)
    this.route.navigate(["/web/client/encounter"], { queryParams: { id: this.commonService.encryptValue(id, true) } });
    
  }
}
