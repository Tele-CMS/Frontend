import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ManageAgencyService } from '../manage-agency.service';
import { ManageAgencyModel } from '../manage-agency.model';
import { CommonService } from '../../core/services';
import { ResponseModel } from '../../../platform/modules/core/modals/common-model';
import { ActivatedRoute } from '@angular/router';
import { PasswordValidator } from '../../../shared/password-validator';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.css']
})
export class AddAgencyComponent implements OnInit {
  agencyModel: ManageAgencyModel;
  agencyForm: FormGroup;
  organizationId: number;
  FaviconBase64: any;
  LogoBase64: any;
  submitted: boolean = false;
  masterDatabase: Array<any> = [];
  subscriptionPlanTypes: any[];

  constructor(private formBuilder: FormBuilder,
    private agencyService: ManageAgencyService, private commonService: CommonService, private activatedRoute: ActivatedRoute, private notifier: NotifierService) {
    this.agencyModel = new ManageAgencyModel();
    this.subscriptionPlanTypes = [{ id: 1, value: 'Weekly' }, { id: 2, value: 'Monthly' }, { id: 3, value: 'Yearly' }];
  }

  ngOnInit() {
    this.agencyForm = this.formBuilder.group({
      id: [this.agencyModel.id],
      organizationName: [this.agencyModel.organizationName],
      businessName: [this.agencyModel.businessName],
      description: [this.agencyModel.description],
      address1: [this.agencyModel.address1],
      apartmentNumber: [this.agencyModel.apartmentNumber],
      city: [this.agencyModel.city],
      zip: [this.agencyModel.zip],
      phone: [this.agencyModel.phone],
      fax: [this.agencyModel.fax],
      email: [this.agencyModel.email],
      isActive: [this.agencyModel.isActive],
      VendorIdDirect: [this.agencyModel.VendorIdDirect],
      VendorNameDirect: [this.agencyModel.VendorNameDirect],
      VendorIdIndirect: [this.agencyModel.VendorIdIndirect],
      VendorNameIndirect: [this.agencyModel.VendorNameIndirect],
      // logo: [this.agencyModel.logo],
      // favicon: [this.agencyModel.favicon],
      contactPersonFirstName: [this.agencyModel.contactPersonFirstName],
      contactPersonMiddleName: [this.agencyModel.contactPersonMiddleName],
      contactPersonLastName: [this.agencyModel.contactPersonLastName],
      contactPersonPhoneNumber: [this.agencyModel.contactPersonPhoneNumber],
      userName: [this.agencyModel.userName],
      password: [this.agencyModel.password,[PasswordValidator.strong]],
      confirmPassword: [this.agencyModel.confirmPassword],
      databaseDetailId: [this.agencyModel.databaseDetailId],
      databaseName: [this.agencyModel.databaseName],
      organizationSubscriptionPlans: this.formBuilder.group({
        id: [this.agencyModel.organizationSubscriptionPlans.id],
        planName: [this.agencyModel.organizationSubscriptionPlans.planName],
        startDate: [this.agencyModel.organizationSubscriptionPlans.startDate],
        planType: [this.agencyModel.organizationSubscriptionPlans.planType],
        amountPerClient: [this.agencyModel.organizationSubscriptionPlans.amountPerClient],
        totalNumberOfClients: [this.agencyModel.organizationSubscriptionPlans.totalNumberOfClients],
        organizationID: [this.agencyModel.organizationSubscriptionPlans.organizationID],
      }),
      organizationSMTPDetail: this.formBuilder.group({
        id: [this.agencyModel.organizationSMTPDetail.id],
        serverName: [this.agencyModel.organizationSMTPDetail.serverName],
        port: [this.agencyModel.organizationSMTPDetail.port],
        connectionSecurity: [this.agencyModel.organizationSMTPDetail.connectionSecurity],
        smtpUserName: [this.agencyModel.organizationSMTPDetail.smtpUserName],
        smtpPassword: [this.agencyModel.organizationSMTPDetail.smtpPassword],
        smtpConfirmPassword: [this.agencyModel.organizationSMTPDetail.smtpConfirmPassword],
        organizationID: [this.agencyModel.organizationSMTPDetail.organizationID],
      }),
    });
    this.loadMasterdata();
    this.activatedRoute.queryParams.subscribe(params => {
      this.organizationId = params.id == undefined ? null : params.id;
      if (this.organizationId != undefined && this.organizationId != null) {
        this.getOrganisationDetailsById();
      }
    });
  }
  loadMasterdata() {
    const masterData = { masterdata: 'ORGANIZATIONDATABASEDETAIL' }
    this.agencyService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response) {
          this.masterDatabase = response.organizationDatabaseDetail || [];
        } else {
          this.masterDatabase = [];
        }
      })
  }
  get formControls() { return this.agencyForm.controls; }
  get formControls1() { return this.agencyForm.get("organizationSMTPDetail")['controls']; }
  get formControls2() { return this.agencyForm.get("organizationSubscriptionPlans")['controls']; }
  onSubmit() {
    if (this.agencyForm.invalid) {
      return;
    }
    this.submitted = true;
    this.agencyModel = this.agencyForm.value;

    const formData = {
      ...this.agencyModel,
      FaviconBase64: this.FaviconBase64,
      LogoBase64: this.LogoBase64,
      organizationSubscriptionPlans: [this.agencyModel.organizationSubscriptionPlans],
      organizationSMTPDetail: [this.agencyModel.organizationSMTPDetail]
    }

    this.agencyService.save(formData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }
  handleImageChange(e, type: string) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {

        if(type == 'logo') {
        this.LogoBase64 = reader.result;
        } else {
          this.FaviconBase64 = reader.result;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
    else
      this.notifier.notify('error', "Please select valid file type");
  }
  getOrganisationDetailsById() {
    this.agencyService.getById(this.organizationId).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.agencyModel = response.data;
        this.agencyModel.confirmPassword = this.agencyModel.password;
        this.agencyModel.organizationSubscriptionPlans = (response.data.organizationSubscriptionPlans && response.data.organizationSubscriptionPlans[0]) || {};
        this.agencyModel.organizationSMTPDetail = (response.data.organizationSMTPDetail && response.data.organizationSMTPDetail[0]) || {};
        this.agencyModel.organizationSMTPDetail.smtpConfirmPassword = this.agencyModel.organizationSMTPDetail.smtpPassword;
        this.LogoBase64 = this.agencyModel.logo;
        this.FaviconBase64 = this.agencyModel.favicon;
        this.agencyForm.patchValue(this.agencyModel);
      }
    });
  }
}
