import { Component, OnInit, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ClientsService } from '../clients.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { ClientModel } from '../client.model';
import { ClientHeaderModel } from '../client-header.model';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent implements OnInit {
  @Input() clientId: number;
  @Input() headerText: string = "Manage Patient";
  clientHeaderModel: ClientHeaderModel;
  constructor(
    private clientService: ClientsService,
    private router: Router,
    private commonService: CommonService
  ) {
    this.clientHeaderModel = new ClientHeaderModel();
  }

  ngOnInit() { 
    
  }
  getClientHeaderInfo() {
    this.clientService.getClientHeaderInfo(this.clientId).subscribe((response: ResponseModel) => { 
      
      if (response != null && response.statusCode == 200) { 
        
        this.clientHeaderModel = response.data;
        this.clientHeaderModel.patientBasicHeaderInfo != null ? this.clientHeaderModel.patientBasicHeaderInfo.dob = format(this.clientHeaderModel.patientBasicHeaderInfo.dob, "MM/DD/YYYY") : '';
        const userId = this.clientHeaderModel.patientBasicHeaderInfo && this.clientHeaderModel.patientBasicHeaderInfo.userId;
        this.clientService.updateClientNavigations(this.clientId, userId);
      }
    });
  }
  ngOnChanges(value: any) {  
    if (this.clientId != undefined && this.clientId != null)
      this.getClientHeaderInfo();
  }


  onNavigate(url: string) {
    if(this.clientId)
      this.router.navigate([url], { queryParams: { id: this.commonService.encryptValue(this.clientId, true) } });
  }

}
