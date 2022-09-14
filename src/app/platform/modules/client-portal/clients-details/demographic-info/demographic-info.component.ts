import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ClientModel, PatientDiagnosis, PatientTag } from "../client.model";
import { ClientsService } from "../clients.service";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { CommonService } from "../../../core/services";
import { ResponseModel } from "../../../core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientHeaderLayoutComponent } from "../.././../../../shared/layout/client-header-layout/client-header-layout.component";
import { from } from "rxjs";
@Component({
  selector: "app-demographic-info",
  templateUrl: "./demographic-info.component.html",
  styleUrls: ["./demographic-info.component.css"]
})
export class DemographicInfoComponent implements OnInit {
  @Output()
  ClientHeaderLayoutComponent: EventEmitter<any> = new EventEmitter<any>();
  demographicInfoForm: FormGroup;
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  clientId: number;
  clientModel: ClientModel;
  masterGender: any = [];
  masterRace: any = [];
  masterEthnicity: any[];
  masterStaff: any[];
  masterDiagnosis: any[];
  masterLocation: any[];
  masterRelationship: any[];
  masterTagsForPatient: any = [];
  masterRenderingProvider: any = [];
  dataURL: any;
  imagePreview: any;
  submitted: boolean = false;
  maxDate = new Date();
  code: string;
  state: string;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private route: Router,
    private notifier: NotifierService,
    private activatedRoute: ActivatedRoute
  ) {
    this.clientModel = new ClientModel();
  }
  ngOnInit() {
    this.demographicInfoForm = this.formBuilder.group({
      firstName: [this.clientModel.firstName],
      middleName: [this.clientModel.middleName],
      lastName: [this.clientModel.lastName],
      gender: [this.clientModel.gender],
      dob: [this.clientModel.dob],
      email: [this.clientModel.email,[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      ssn: [this.clientModel.ssn],
      mrn: [this.clientModel.mrn],
      race: [this.clientModel.race],
      secondaryRaceID: [this.clientModel.secondaryRaceID],
      ethnicity: [this.clientModel.ethnicity],
      primaryProvider: [this.clientModel.primaryProvider],
      renderingProviderID: [this.clientModel.renderingProviderID],
      locationID: [this.clientModel.locationID],
      userName: [this.clientModel.userName],
      isPortalRequired: [this.clientModel.isPortalRequired],
      emergencyContactRelationship: [
        this.clientModel.emergencyContactRelationship
      ],
      emergencyContactFirstName: [this.clientModel.emergencyContactFirstName],
      emergencyContactLastName: [this.clientModel.emergencyContactLastName],
      emergencyContactPhone: [this.clientModel.emergencyContactPhone],
      photoThumbnailPath: [this.clientModel.photoThumbnailPath],
      photoPath: [this.clientModel.photoPath],
      note: [this.clientModel.note],
      tag: [this.clientModel.tag],
      clientImg: [],
      icdid: [this.clientModel.icdid],
      identifier: [this.clientModel.identifier]
    });
    this.getMasterData();
    this.getCurrentLocations();
    if (this.clientId != null) this.getClientInfo();

    //this.activatedRoute.queryParams.subscribe(params => {
      //this.clientId = params.id==undefined?null:parseInt(this.commonService.encryptValue(params.id,false));
      //this.code = params.code==undefined?null:params.code;
     // this.state = params.state==undefined?null:params.state;
    //});
    //this.getPatientDetailsBB(this.code);
  }
  get formControls() {
    return this.demographicInfoForm.controls;
  }

  onSubmit(event: any) {
    //this.demographicInfoForm.get('firstName').markAsTouched();
    if (!this.demographicInfoForm.invalid) {
      let clickType = event.currentTarget.name;
      this.clientModel = this.demographicInfoForm.value;
      this.clientModel.id = this.clientId;

      this.clientModel.dob = new Date(this.clientModel.dob);
      this.clientModel.PhotoBase64 = this.dataURL || null;
      if (this.clientModel.icdid != null) {
        this.clientModel.patientDiagnosis = new Array<PatientDiagnosis>();
        let patientDiag = new PatientDiagnosis();
        patientDiag.patientID = this.clientId;
        patientDiag.icdid = this.clientModel.icdid;
        patientDiag.isPrimary = true;
        this.clientModel.patientDiagnosis.push(patientDiag);
      }
      if (this.clientModel.tag != null) {
        this.clientModel.patientTags = new Array<PatientTag>();
        let patientTag = new PatientTag();
        this.clientModel.tag.forEach(x => {
          patientTag = { patientID: this.clientId, isDeleted: false, tagID: x };
          this.clientModel.patientTags.push(patientTag);
        });
      }
      this.submitted = true;
      this.clientService
        .create(this.clientModel)
        .subscribe((response: ResponseModel) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.clientId = response.data.id;
            this.commonService.initializeAuthData();
            // this.route.navigate(["web/client/client-profile"], { queryParams: { id: this.commonService.encryptValue(this.clientId,true) } });
            this.notifierService.notify("success", response.message);
            this.handleTabChange.next({
              tab: "Address",
              id: response.data.id,
              clickType: clickType
            });
          } else {
            this.notifierService.notify("error", response.message);
          }
        });
    }
  }

  getCurrentLocations() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.masterLocation = (user.userLocations || []).map((obj: any) => {
          return {
            id: obj.id,
            value: obj.locationName
          };
        });
      }
    });
  }

  handleImageChange(e) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }

  getMasterData() {
    let data =
      "MASTERGENDER,MasterLocation,MASTERRACE,MASTERETHNICITY,MASTERSTAFF,MASTERICD,MASTERRELATIONSHIP,MASTERRENDERINGPROVIDER,MASTERTAGSFORPATIENT";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterGender =
          response.masterGender != null ? response.masterGender : [];
        this.masterRace =
          response.masterRace != null ? response.masterRace : [];
        this.masterEthnicity =
          response.masterEthnicity != null ? response.masterEthnicity : [];
        this.masterRelationship =
          response.masterRelationship != null
            ? response.masterRelationship
            : [];
        this.masterRenderingProvider =
          response.masterRenderingProvider != null
            ? response.masterRenderingProvider
            : [];
        this.masterTagsForPatient =
          response.masterTagsforPatient != null
            ? response.masterTagsforPatient
            : [];
        this.masterDiagnosis =
          response.masterICD != null ? response.masterICD : [];
      }
    });
  }

  getClientInfo() {
    this.clientService
      .getClientById(this.clientId)
      .subscribe((response: any) => {
        if (response != null) {
          this.clientModel = response.data;
          this.clientModel.tag =
            this.clientModel.patientTags != null
              ? this.clientModel.patientTags.map(({ tagID }) => tagID)
              : [];
          this.imagePreview = this.clientModel.photoThumbnailPath || "";
          const primaryDiagnosis =
            this.clientModel.patientDiagnosis &&
            this.clientModel.patientDiagnosis.find(x => x.isPrimary == true);
          this.clientModel.icdid = primaryDiagnosis && primaryDiagnosis.icdid;
          this.demographicInfoForm.patchValue(this.clientModel);
        }
      });
  }
}
