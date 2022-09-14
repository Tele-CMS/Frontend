import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientsService } from '../clients.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-eligibility-enquiry',
  templateUrl: './eligibility-enquiry.component.html',
  styleUrls: ['./eligibility-enquiry.component.css']
})
export class EligibilityEnquiryComponent implements OnInit {
  eligibilityForm: FormGroup;
  masterServiceCode: any = [];
  masterServiceTypeCodes: any = [];
  patientPayers: any = [];
  clientId: number;
  submitted: boolean = false;
  serviceTypes: any = [];
  constructor(private formBuilder: FormBuilder, private clientService: ClientsService, private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EligibilityEnquiryComponent>) {
    this.clientId = parseInt(this.data);
  }

  ngOnInit() {
    this.eligibilityForm = this.formBuilder.group({
      payerId: [],
      serviceCodeIds: [],
      serviceTypeCodeIds: []

    });
    this.getMasterData();
    this.getPayerByPatient();
    this.getEligibilityEnquiryServiceCodes();
  }
  get formControls() {
    return this.eligibilityForm.controls;
  }

  onSubmit() {
    if (!this.eligibilityForm.invalid) {
      if (this.serviceTypes.length == 0) {
        this.notifier.notify('error', "Please select at least one service type");
        return;
      }
      let formvalue = this.eligibilityForm.value;
      this.submitted=true;
      this.clientService.download270(this.clientId, formvalue.payerId, this.serviceTypes, formvalue.serviceCodeIds).subscribe((response: any) => {
        this.submitted=false;
        this.clientService.downloadFile(response, 'text/plain', "EligibilityRequestFile.x12");
        this.closeDialog('save');
      });
    }
  }
  addServiceType(value: any, code: any) {
    if (value) {
      this.serviceTypes.push(code.id);
    }
    else {
      let index = this.serviceTypes.findIndex(x => x == code.id);
      if (index != -1) {
        this.serviceTypes.splice(index, 1);
      }
    }
  }
  getMasterData() {
    this.clientService.getMasterData("MASTERSERVICECODE").subscribe((response: any) => {
      if (response != null) {
        this.masterServiceCode = response.masterServiceCode;
      }
    });
  }
  getPayerByPatient() {
    this.clientService.getPayerByPatient(this.clientId, "PRIMARY").subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.patientPayers = response.data;
      }
    });
  }
  getEligibilityEnquiryServiceCodes() {
    this.clientService.getEligibilityEnquiryServiceCodes().subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.masterServiceTypeCodes = response.data;
      }
    });
  }
  closeDialog(action: string): void {
    this.dialogRef.close(action);
  }
}
