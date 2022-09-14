import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientLedgerPaymentDetailsModel, MasterPaymentDescription, MasterPaymentType, AdjustmentGroupCodeModel } from '../client-ledger.model';
import { ClientsService } from '../../clients.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ResponseModel } from '../../../../core/modals/common-model';

@Component({
  selector: 'app-add-payment-detail',
  templateUrl: './add-payment-detail.component.html',
  styleUrls: ['./add-payment-detail.component.css']
})
export class AddPaymentDetailComponent implements OnInit {
  paymentDetailForm: FormGroup;
  headerText: string = '';
  paymentDetailModel: ClientLedgerPaymentDetailsModel;
  paymentSourceArray: any = ['Self', 'Guarantor', 'Insurance']
  masterPaymentDescription: Array<MasterPaymentDescription> = [];
  masterPaymentType: Array<MasterPaymentType> = [];
  masterAdjGroupCodes: Array<AdjustmentGroupCodeModel> = [];
  patientPayers: any = [];
  patientGuarantor: any = [];
  paymentSourceType: string = 'Self'
  clientId: number;
  submitted: boolean = false;
  disableSource:boolean=false;
  tempPmtTypes:any=[];
  tempDescType:any=[];
  constructor(private formBuilder: FormBuilder, private clientService: ClientsService,
    private notifier: NotifierService,
    private dialogModalRef: MatDialogRef<AddPaymentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.paymentDetailModel = this.data.paymentModel;
    this.clientId = this.data.clientId;
    if (this.paymentDetailModel.id != undefined && this.paymentDetailModel.id > 0) {
      this.disableSource=true;
      this.headerText = "Edit Payment Detail";
    }
    else {
      this.disableSource=false;
      this.headerText = "Add Payment Detail";
    }

  }
  ngOnInit() {
    let pmtSource = '';
    if (this.paymentDetailModel.id != undefined && this.paymentDetailModel.id > 0)
      pmtSource = this.paymentDetailModel.patientId > 0 ? 'Self' : this.paymentDetailModel.patientInsuranceId > 0 ? 'Insurance' : this.paymentDetailModel.guarantorId > 0 ? 'Guarantor' : '';
    this.paymentDetailForm = this.formBuilder.group({
      id: [this.paymentDetailModel.id],
      paymentSource: [pmtSource],
      amount: [this.paymentDetailModel.amount],
      descriptionTypeId: [this.paymentDetailModel.descriptionTypeId],
      notes: [this.paymentDetailModel.notes],
      paymentDate: [this.paymentDetailModel.paymentDate],
      paymentTypeId: [this.paymentDetailModel.paymentTypeId],
      patientInsuranceId: [this.paymentDetailModel.patientInsuranceId],
      patientId: [this.paymentDetailModel.patientId],
      guarantorId: [this.paymentDetailModel.guarantorId],
      serviceLineId: [this.paymentDetailModel.serviceLineId],
      adjustmentGroupCode: [this.paymentDetailModel.adjustmentGroupCode],
      adjustmentReasonCode: [this.paymentDetailModel.adjustmentReasonCode]
    });
    this.getMasterData();
    this.changePaymentSource(pmtSource);
  }
  get formControls() {
    return this.paymentDetailForm.controls;
  }
  getMasterData() {
    this.clientService.getMasterData("MasterPaymentDescription,MasterPaymentType,MASTERADJUSTMENTGROUPCODE").subscribe((response: any) => {
      if (response != null) {
        this.masterAdjGroupCodes = response.adjustmentGroupCodeModel != null ? response.adjustmentGroupCodeModel : [];
        this.masterPaymentDescription = response.masterPaymentDescription != null ? response.masterPaymentDescription : [];
        this.masterPaymentType = response.masterPaymentType != null ? response.masterPaymentType : [];
      }
    });
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  changePaymentSource(value: string,descType:string='') {
    if (value == 'Insurance') {
      this.paymentSourceType = "Insurance"
      this.tempPmtTypes=this.masterPaymentType.filter(x=>x.associatedEntity.toLocaleLowerCase()=="insurance");
      //this.tempPmtTypes=this.masterPaymentDescription.filter(x=>x.key.toLocaleLowerCase()=="adjustment");
      this.paymentDetailForm.controls.guarantorId.clearValidators();
      this.paymentDetailForm.controls.guarantorId.updateValueAndValidity();
      this.clientService.getPayerByPatient(this.clientId, 'ALL').subscribe((response: ResponseModel) => {
        if (response != null && response.data != null)
          this.patientPayers = response.data;
      });
    }
    else if (value == 'Guarantor') {
      this.paymentSourceType = "Guarantor";
      this.tempPmtTypes=this.masterPaymentType.filter(x=>x.associatedEntity.toLocaleLowerCase()=="patient");
      this.paymentDetailForm.controls.patientInsuranceId.clearValidators();
      this.paymentDetailForm.controls.patientInsuranceId.updateValueAndValidity();
      this.clientService.getPatientGuarantor(this.clientId).subscribe((response: ResponseModel) => {
        if (response != null && response.data != null)
          this.patientGuarantor = response.data;
      });
    }
    else {
      this.paymentSourceType = "Patient";
      this.tempPmtTypes=this.masterPaymentType.filter(x=>x.associatedEntity.toLocaleLowerCase()=="patient");
      this.paymentDetailForm.controls.patientInsuranceId.clearValidators();
      this.paymentDetailForm.controls.patientInsuranceId.updateValueAndValidity();
      this.paymentDetailForm.controls.guarantorId.clearValidators();
      this.paymentDetailForm.controls.guarantorId.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.paymentDetailForm.invalid) {
      let formValues = this.paymentDetailForm.value;
      if (formValues.paymentSource == "Insurance") {
        formValues.patientId = null;;
        formValues.guarantorId = null
      }
      else if (formValues.paymentSource == "Guarantor") {
        formValues.patientId = null;;
        formValues.patientInsuranceId = null
      }
      else {
        formValues.patientInsuranceId = null;;
        formValues.guarantorId = null
        formValues.patientId = this.clientId;

      }
      this.submitted = true;
      this.clientService.saveServiceLinePayment(formValues).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null && response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        }
        else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
}
