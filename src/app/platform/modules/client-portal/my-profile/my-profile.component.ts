import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientsService } from "../clients.service";
import {
  ClientProfileModel,
  PatientInsuranceModel,
  PatientAllergyModel,
  PatientImmunization,
  PatientMedicationModel,
  PatientAppointmentListModel,
  PatientAuthorizationModel,
  PatientMedicalFamilyHistoryModel,
  ChatHistoryModel
} from "../client-profile.model";
import { NotifierService } from "angular-notifier";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { Subscription } from "rxjs";
import { CommonService } from "../../core/services/common.service";
import { format } from "date-fns";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"]
})
export class MyProfileComponent implements OnInit {
  clientId: number;
  locationId: number;
  subscription: Subscription;
  clientProfileModel: ClientProfileModel;
  clientImmunizationModel: PatientImmunization;
  clientMedicationModel: PatientMedicationModel;
  clientAppointmentListModel: PatientAppointmentListModel;
  clientAllergyListModel: PatientAllergyModel;
  clientInsuranceListModel: PatientInsuranceModel;
  patientMedicalFamilyHistoryModel: PatientMedicalFamilyHistoryModel;
  clientAthorizationListModel: PatientAuthorizationModel;
  metaData: any = {};
  ClientImmunizationFilterModelMetaData: any = {};
  ClientMedicationFilterModelMetaData: any = {};
  PatientAllergyListFilterModelMetaData: any = {};
  PatientInsuranceListFilterModelMetaData: any = {};
  PatientAuthorizationListFilterModelMetaData: any = {};
  immunizationColumns: Array<any>;
  medicationColumns: Array<any>;
  allergyColumns: Array<any>;
  insuranceColumns: Array<any>;
  authorizationColumns: Array<any>;
  actionButtons: Array<any> = [];
  //chat
  fromUserId: number;
  chatHistoryData: Array<ChatHistoryModel> = [];
  filterModel: FilterModel;
  ClientImmunizationFilterModel: FilterModel;
  ClientMedicationFilterModel: FilterModel;
  PatientAllergyListFilterModel: FilterModel;
  PatientInsuranceListFilterModel: FilterModel;
  PatientAuthorizationListFilterModel: FilterModel;
  constructor(
    private clientService: ClientsService,
    private router: Router,
    private commonService: CommonService,
    private notifier: NotifierService
  ) {
    this.immunizationColumns = [
      {
        displayName: "IMMUNIZATION",
        key: "vaccineName",
        class: "",
        width: "35%",
        isSort: true
      },
      {
        displayName: "AMOUNT",
        key: "amountAdministered",
        class: "",
        width: "15%",
        type: "decimal",
        isSort: true
      },
      {
        displayName: "ADMINISTERED DATE",
        key: "administeredDate",
        class: "",
        width: "25%",
        type: "date",
        isSort: true
      },
      {
        displayName: "ROUTE OF ADMINISTRATION",
        key: "routeOfAdministration",
        width: "25%",
        isSort: true
      }
      //{ displayName: 'IMMUNITY STATUS', key: 'immunityStatusID', width: '15%' }
    ];
    this.medicationColumns = [
      { displayName: "MEDICATION", key: "medicine", class: "", width: "20%",
      isSort: true },
      { displayName: "DOSE", key: "dose", class: "", width: "20%",
      isSort: true },
      { displayName: "STRENGTH", key: "strength", class: "", width: "20%",
      isSort: true },
      {
        displayName: "START DATE",
        key: "startDate",
        width: "20%",
        type: "date",
        isSort: true
      },
      { displayName: "END DATE", key: "endDate", width: "20%", type: "date",
      isSort: true },
      {
        displayName: "STATUS",
        key: "isActive",
        width: "10%",
        type: ["Active", "Inactive"]
      }
    ];
    this.allergyColumns = [
      {
        displayName: "ALLERGY TYPE",
        key: "allergyType",
        class: "",
        width: "20%",
        isSort: true
      },
      { displayName: "ALLERGEN", key: "allergen", class: "", width: "20%",
      isSort: true },
      { displayName: "NOTE", key: "note", class: "", width: "20%",
      isSort: true },
      { displayName: "REACTION", key: "reaction", width: "20%",
      isSort: true },
      {
        displayName: "CREATED DATE",
        key: "createdDate",
        width: "10%",
        type: "date",
        isSort: true
      },
      {
        displayName: "STATUS",
        key: "isActive",
        width: "10%",
        type: ["Active", "Inactive"]
      }
    ];
    this.insuranceColumns = [
      {
        displayName: "INSURANCE COMPANY",
        key: "insuranceCompanyName",
        class: "",
        width: "20%",
        isSort: true
      },
      {
        displayName: "ISSUE DATE",
        key: "cardIssueDate",
        class: "",
        width: "20%",
        type: "date",
        isSort: true
      },
      {
        displayName: "ID NUMBER",
        key: "insuranceIDNumber",
        class: "",
        width: "20%",
        isSort: true
      },
      { displayName: "PLAN NAME", key: "insurancePlanName", width: "20%",
      isSort: true },
      {
        displayName: "COMPANY ADDRESS",
        key: "insuranceCompanyAddress",
        width: "20%",
        isSort: true
      }
    ];
    this.authorizationColumns = [
      {
        displayName: "AUTH #",
        key: "authorizationNumber",
        class: "",
        width: "20%",
        isSort: true
      },
      {
        displayName: "TITLE",
        key: "authorizationTitle",
        class: "",
        width: "20%",
        isSort: true
      },
      {
        displayName: "INSURANCE COMPANY",
        key: "payerName",
        class: "",
        width: "20%",
        isSort: true
      },
      {
        displayName: "START DATE",
        key: "startDate",
        width: "20%",
        type: "date"
      },
      { displayName: "END DATE", key: "endDate", width: "20%", type: "date",
      isSort: true }
    ];
    this.filterModel = new FilterModel();
    this.ClientImmunizationFilterModel = new FilterModel();
    this.ClientMedicationFilterModel = new FilterModel();
    this.PatientAllergyListFilterModel = new FilterModel();
    this.PatientInsuranceListFilterModel = new FilterModel();
    this.PatientAuthorizationListFilterModel = new FilterModel();
  }
  profileTabs: any;
  historyTabs: any;
  selectedIndex: number = 0;
  selectedIndexForHistoryTabs: number = 0;
  showupcomingappts: boolean=false;
  showlastappts: boolean=false;
  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.clientId = user.id;
          this.fromUserId = user.userID;
          this.locationId = user.locationID;
          this.getClientProfileInfo();
          this.getClientImmunization();
          this.getPatientAllergyList();
        }
      }
    );
    // this.profileTabs = ["Immunization", "Medication", "Labs", "Appointment"];
    this.profileTabs = ["Immunization", "Medication", "Appointment"];
    // this.historyTabs = ["Allergies", "Insurance", "Authorizations", "History"];
    this.historyTabs = ["Allergies", "Insurance", "History"];
  }
  getClientProfileInfo() {
    this.clientService
      .getClientProfileInfo(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientProfileModel = response.data;
          if(this.clientProfileModel.upcomingAppointmentDetails.length>0){
               this.showupcomingappts=true;
          }
          if(this.clientProfileModel.lastAppointmentDetails.length>0){
            this.showlastappts=true;
       }
          if (this.clientProfileModel) {
            this.getChatHistory();
          }
        }
      });
  }
  onPageOrSortChange(changeState?: any,forList?:string) {
    this.setPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);

    if(forList == 'clientImmunization'){
      this.getClientImmunization();
    }
    else if(forList == 'clientMedication'){
      this.getClientMedication();
    }
    else if(forList == 'clientAllergyList'){
      this.getPatientAllergyList();
    }
    else if(forList == 'clientInsuranceList'){
      this.getPatientInsuranceList();
    }
    else if(forList == 'clientAthorizationList'){
      this.getPatientAuthorizationList();
    }

  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  onClientImmunizationPageOrSortChange(changeState?: any,forList?:string) {
    this.setClientImmunizationPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.ClientImmunizationFilterModel.searchText);
      this.getClientImmunization();
  }
  onClientMedicationPageOrSortChange(changeState?: any,forList?:string) {
    this.setClientMedicationPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.ClientMedicationFilterModel.searchText);
      this.getClientMedication();
  }
  onPatientAllergyPageOrSortChange(changeState?: any,forList?:string) {
    this.setPatientAllergyPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.PatientAllergyListFilterModel.searchText);
      this.getPatientAllergyList();
  }
  ongetPatientInsurancePageOrSortChange(changeState?: any,forList?:string) {
    this.setPatientInsurancePaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.PatientInsuranceListFilterModel.searchText);
      this.getPatientInsuranceList();
  }
  onPatientAuthorizationPageOrSortChange(changeState?: any,forList?:string) {
    this.setPatientAuthorizationPaginatorModel(changeState.pageNumber, changeState.pageSize, changeState.sort, changeState.order, this.PatientAuthorizationListFilterModel.searchText);
      this.getPatientAuthorizationList();
  }

  setClientImmunizationPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.ClientImmunizationFilterModel.pageNumber = pageNumber;
    this.ClientImmunizationFilterModel.pageSize = pageSize;
    this.ClientImmunizationFilterModel.sortOrder = sortOrder;
    this.ClientImmunizationFilterModel.sortColumn = sortColumn;
    this.ClientImmunizationFilterModel.searchText = searchText;
  }
  setClientMedicationPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.ClientMedicationFilterModel.pageNumber = pageNumber;
    this.ClientMedicationFilterModel.pageSize = pageSize;
    this.ClientMedicationFilterModel.sortOrder = sortOrder;
    this.ClientMedicationFilterModel.sortColumn = sortColumn;
    this.ClientMedicationFilterModel.searchText = searchText;
  }
  setPatientAllergyPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.PatientAllergyListFilterModel.pageNumber = pageNumber;
    this.PatientAllergyListFilterModel.pageSize = pageSize;
    this.PatientAllergyListFilterModel.sortOrder = sortOrder;
    this.PatientAllergyListFilterModel.sortColumn = sortColumn;
    this.PatientAllergyListFilterModel.searchText = searchText;
  }
  setPatientInsurancePaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.PatientInsuranceListFilterModel.pageNumber = pageNumber;
    this.PatientInsuranceListFilterModel.pageSize = pageSize;
    this.PatientInsuranceListFilterModel.sortOrder = sortOrder;
    this.PatientInsuranceListFilterModel.sortColumn = sortColumn;
    this.PatientInsuranceListFilterModel.searchText = searchText;
  }
  setPatientAuthorizationPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.PatientAuthorizationListFilterModel.pageNumber = pageNumber;
    this.PatientAuthorizationListFilterModel.pageSize = pageSize;
    this.PatientAuthorizationListFilterModel.sortOrder = sortOrder;
    this.PatientAuthorizationListFilterModel.sortColumn = sortColumn;
    this.PatientAuthorizationListFilterModel.searchText = searchText;
  }
  getClientImmunization() {

    this.clientService
      .getImmunizationListPaginator(this.ClientImmunizationFilterModel,this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {

          this.clientImmunizationModel = response.data;
          this.ClientImmunizationFilterModelMetaData = response.meta || [];
        }else{
          this.clientImmunizationModel = new PatientImmunization();
          this.ClientImmunizationFilterModelMetaData = [];
        }
        this.ClientImmunizationFilterModelMetaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getClientMedication() {
    this.clientService
      .getMedicationListPaginator(this.ClientMedicationFilterModel,this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientMedicationModel = response.data;
          this.ClientMedicationFilterModelMetaData = response.meta || [];
        }else{
          this.clientMedicationModel = new PatientMedicationModel();
          this.ClientMedicationFilterModelMetaData = [];
        }
        this.ClientMedicationFilterModelMetaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getPatientAppointmentList() {
    this.clientService
      .getPatientAppointmentList(this.locationId, this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAppointmentListModel = response.data;
          this.metaData = response.meta;
        }else{
          this.clientAppointmentListModel = new PatientAppointmentListModel();
          this.metaData = [];
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getPatientAllergyList() {
    this.clientService
      .getAllergyListPaginator(this.PatientAllergyListFilterModel,this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAllergyListModel = response.data;
          this.PatientAllergyListFilterModelMetaData = response.meta;
        }else{
          this.clientAllergyListModel = new PatientAllergyModel();
          this.PatientAllergyListFilterModelMetaData = [];
        }
        this.PatientAllergyListFilterModelMetaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getPatientInsuranceList() {
    this.clientService
      .getPatientInsurancePaginator(this.PatientInsuranceListFilterModel,this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientInsuranceListModel = response.data.PatientInsurance;
          this.PatientInsuranceListFilterModelMetaData = response.meta || [];
          this.PatientInsuranceListFilterModelMetaData.totalRecords =  response.data.PatientInsurance[0].totalRecords
        }else{
          this.clientInsuranceListModel = new PatientInsuranceModel();
          this.PatientInsuranceListFilterModelMetaData = [];
        }
        this.PatientInsuranceListFilterModelMetaData.pageSizeOptions = [5,10,25,50,100];
      });
    // this.clientService
    //   .getPatientInsurance(this.clientId)
    //   .subscribe((response: ResponseModel) => {
    //     if (response != null && response.statusCode == 200) {
    //       this.clientInsuranceListModel = response.data.PatientInsurance;
    //       this.PatientInsuranceListFilterModelMetaData = response.meta || [];
    //     }else{
    //       this.clientInsuranceListModel = new PatientInsuranceModel();
    //       this.PatientInsuranceListFilterModelMetaData = [];
    //     }
    //     this.PatientInsuranceListFilterModelMetaData.pageSizeOptions = [5,10,25,50,100];
    //   });
  }
  getPatientAuthorizationList() {
    this.clientService
      .getAllAuthorizationPaginator(this.PatientAuthorizationListFilterModel,this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAthorizationListModel = response.data.Authorization;
          this.PatientAuthorizationListFilterModelMetaData = response.meta;
        }else{
          this.clientAthorizationListModel = new PatientAuthorizationModel();
          this.PatientAuthorizationListFilterModelMetaData = [];
        }
        this.PatientAuthorizationListFilterModelMetaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  getPatientMedicalFamilyHistoryList() {
    this.clientService
      .getPatientMedicalFamilyHistoryList(this.clientId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.patientMedicalFamilyHistoryModel = response.data;
        }
      });
  }

  loadComponent(event: any) {
    this.selectedIndex = event.index;

    switch (this.selectedIndex) {
      case 0: {
        this.getClientImmunization();
        break;
      }
      case 1: {
        this.getClientMedication();
        break;
      }
      case 2: {
        break;
      }
      case 3: {
        this.getPatientAppointmentList();
        break;
      }
    }
  }
  loadComponentForHistoryTabs(event: any) {
    this.selectedIndexForHistoryTabs = event.index;

    switch (this.selectedIndexForHistoryTabs) {
      case 0: {
        this.getPatientAllergyList();
        break;
      }
      case 1: {
        this.getPatientInsuranceList();
        break;
      }
      // case 2: {
      //   this.getPatientAuthorizationList();
      //   break;
      // }
      case 2: {
        this.getPatientMedicalFamilyHistoryList();
        break;
      }
    }
  }
  getPatientCCDA() {
    this.clientService
      .getPatientCCDA(this.clientId)
      .subscribe((response: any) => {
        this.clientService.downloadFile(
          response,
          "application/xml",
          "CCDA.zip"
        );
      });
  }
  //chat
  getChatHistory() {
    this.clientService
      .getChatHistory(
        this.fromUserId,
        this.clientProfileModel.patientInfo[0].renderingProviderId
      )
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.chatHistoryData =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          // this.createModal(this.chatHistoryData);
        }
      });
  }
  editProfile(event: any) {
    this.router.navigate(["/web/client/client-profile"], {
      queryParams: {
        id:
          this.clientId != null
            ? this.commonService.encryptValue(this.clientId, true)
            : null
      }
    });
  }

  get getPatientEligibilityModel() {
    return this.clientProfileModel && this.clientProfileModel.patientEligibilityModel;
  }
}
