import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClientsService } from '../clients.service';
import { ClientProfileModel, PatientInfo } from '../client-profile.model';
import { ResponseModel } from '../../../core/modals/common-model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material';
import { EligibilityEnquiryComponent } from '../eligibility-enquiry/eligibility-enquiry.component';
import { CommonService, LayoutService } from '../../../core/services';
import { ChatHistoryModel } from './chat-history.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  clientId: number;
  clientProfileModel: ClientProfileModel;
  //chat
  userId: number;
  chatHistoryData: Array<ChatHistoryModel> = [];
  constructor(private chatDialogModal: MatDialog, private activatedRoute: ActivatedRoute, private clientService: ClientsService, private router: Router, private notifier: NotifierService, private eligibilityDialogModal: MatDialog, private commonService: CommonService
    ) { }
  profileTabs: any;
  selectedIndex: number = 0
  isPortalActivate: boolean = true;
  portalPermission: boolean;
  editClientPermission: boolean;
  statusPermission: boolean;
  lockPermission: boolean;
  ngOnInit() {
    //chat
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.userId = user.userID;
      }
    })

    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
      this.clientProfileModel = new ClientProfileModel();
      this.getClientProfileInfo();
    });
     this.profileTabs = ["Diagnosis", "Allergies", "Medication", "Labs", "Family History"];
    // this.profileTabs = ["Diagnosis", "Allergies", "Medication", "Family History"];
    this.getUserPermissions();
  }
  getClientProfileInfo() {
    this.clientService.getClientProfileInfo(this.clientId).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {

        this.clientProfileModel = response.data;
        this.isPortalActivate = this.clientProfileModel.patientInfo[0].isPortalActivate;
        const userId = this.clientProfileModel.patientInfo[0] && this.clientProfileModel.patientInfo[0].userID;
        this.clientService.updateClientNavigations(this.clientId, userId);
        if (this.clientProfileModel) {
          this.getChatHistory();
        }
      }
    });
  }

  editProfile() {
    this.router.navigate(["web/client"], { queryParams: { id: (this.clientId != null ? this.commonService.encryptValue(this.clientId, true) : null) } });
  }
  loadComponent(event: any) {
    this.selectedIndex = event.index;
  }
  changeStatus(event: any) {
    this.clientService.updateClientStatus(this.clientId, event.checked).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.notifier.notify('success', response.message);
      }
      else
        this.notifier.notify('error', response.message);
    });
  }

  changeUserStatus(event: any, patientInfo: PatientInfo) {
    if (patientInfo != null && patientInfo.userID > 0) {
      this.clientService.updateUserStatus(patientInfo.userID, event.checked).subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message);
        }
        else
          this.notifier.notify('error', response.message);
      });
    }
  }
  getPatientCCDA() {
    this.clientService.getPatientCCDA(this.clientId).subscribe((response: any) => {
      this.clientService.downloadFile(response, 'application/xml', "CCDA.zip");
    });
  }
  updatePatientPortalVisibility(value: boolean, patientInfo: PatientInfo) {
    
    if (patientInfo != null && patientInfo.userID > 0) {
      const webUrl = window.location.origin;
      let clientLoginURL= `${webUrl}/web/client-login`
      this.clientService.updatePatientPortalVisibility(this.clientId, patientInfo.userID, (value == true ? false : true),clientLoginURL).subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.isPortalActivate = value == true ? false : true;
        }
        else
          this.notifier.notify('error', response.message);
      });
    }
  }

  // checkEligibilityModal() {
  //   let dialogModal;
  //   dialogModal = this.eligibilityDialogModal.open(EligibilityEnquiryComponent, { data: this.clientId })
  //   dialogModal.afterClosed().subscribe((result: string) => {
  //   });
  // }

  checkEligibilityModal() {
    this.clientService.getPayerByPatient(this.clientId, "PRIMARY").subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200 && response.data.length > 0) {
          let dialogModal;
    dialogModal = this.eligibilityDialogModal.open(EligibilityEnquiryComponent, { data: this.clientId })
    dialogModal.afterClosed().subscribe((result: string) => {
    });
      }
      else{
        this.notifier.notify('error', "Primary insurance details doesn't exists for this client");
      }
    });
  }

  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions('CLIENT', 'CLIENT_PROFILE');
    const { CLIENT_PROFILE_PORTAL, CLIENT_PROFILE_UPDATE, CLIENT_INSURANCE_CHANGESTATUS, CLIENT_INSURANCE_CHANGELOCK } = actionPermissions;

    this.portalPermission = CLIENT_PROFILE_PORTAL || false;
    this.editClientPermission = CLIENT_PROFILE_UPDATE || false;
    this.statusPermission = CLIENT_INSURANCE_CHANGESTATUS || false;
    this.lockPermission = CLIENT_INSURANCE_CHANGELOCK || false;

  }

  //chat
  getChatHistory() {
    //this.clientProfileModel.patientInfo[0].userID
    this.clientService.getCareChatHistory(this.userId, this.clientProfileModel.patientInfo[0].userID).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.chatHistoryData = response.data != null && response.data.length > 0 ? response.data : [];
        // this.createModal(this.chatHistoryData);
      }
    });
  }
  onChatNavigate() {
    var patientId = this.clientId;
    this.commonService.onPatientChatNavigation({patientId, isOpenChat: true });
  }
}
