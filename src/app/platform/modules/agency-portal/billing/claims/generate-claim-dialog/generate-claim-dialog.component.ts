import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimsService } from '../claims.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResponseModel } from '../../../../core/modals/common-model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-generate-claim-dialog',
  templateUrl: './generate-claim-dialog.component.html',
  styleUrls: ['./generate-claim-dialog.component.css']
})
export class GenerateClaimDialogComponent implements OnInit {
  generateClaimForm: FormGroup;
  claimId: number;
  patientId: number;
  submitted: boolean = false;
  ClaimForms: Array<any>;
  printFormats: Array<any>;
  patientPayers: Array<any>;
  claimResubmissionReason: Array<any>;
  isEDIClaim: boolean;
  multipleClaimIds: string;
  isResubmitClaim: boolean;
  payerPreference: string = 'PRIMARY';

  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimsService,
    private notifier: NotifierService,
    public dialogPopup: MatDialogRef<GenerateClaimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (!data.multipleClaimIds) {
      this.claimId = data.claimId;
      this.patientId = data.patientId;
      this.multipleClaimIds = null;
      this.isResubmitClaim = data.isResubmitClaim || false;

      if (data.payerPreference) {
        this.payerPreference = data.payerPreference;
      }

    } else {
      this.multipleClaimIds = data.multipleClaimIds;
      this.isResubmitClaim = false;
    }
    this.isEDIClaim = false;
    this.patientPayers = [];
    this.claimResubmissionReason = [];
    this.ClaimForms = [{ id: 1, value: 'Form 1500' }, { id: 2, value: 'EDI 837' }];
    this.printFormats = [{ id: 1, value: 'Normal' }, { id: 2, value: 'Pre-Printed' }];

  }

  ngOnInit() {
    this.initializeFormFields();
    this.fetchPatientPayers(this.patientId);
    if (this.isResubmitClaim)
      this.fetchMasterData();
  }

  initializeFormFields() {
    const configControls = {
      'patientInsuranceId': [''],
      'claimForm': [''],
      'markSubmitted': [false],
      'printFormat': [''],
      'resubmissionReason': [''],
      'payerControlReferenceNumber': [''],
    }
    this.generateClaimForm = this.formBuilder.group(configControls);

  }

  get formControls() { return this.generateClaimForm.controls; }

  onChangePatientInsurance(insId: number) {
    const insObj = (this.patientPayers || []).find(obj => obj.id == insId);
    if (insObj && insObj.payerPreference.toUpperCase() == 'PRIMARY') {
      this.generateClaimForm.patchValue({
        printFormat: insObj.form1500PrintFormat
      })
      if (insObj.isEDIPayer)
        this.ClaimForms = [{ id: 1, value: 'Form 1500' }, { id: 2, value: 'EDI 837' }];
      else
        this.ClaimForms = [{ id: 1, value: 'Form 1500' }];
    }
  }

  onChangeClaimForm(claimFormId: number) {
    if (claimFormId == 2) {
      this.generateClaimForm.patchValue({
        markSubmitted: true
      })
      this.isEDIClaim = true;
    } else {
      this.generateClaimForm.patchValue({
        markSubmitted: false
      })
      this.isEDIClaim = false;
    }
  }

  onClose(): void {
    this.dialogPopup.close();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.generateClaimForm.invalid) {
      this.submitted = false;
      return;
    }
    const formData = this.generateClaimForm.value;

    // form multiple claims ...
    if (this.multipleClaimIds) {
      this.claimService.batchPaperClaimGenerate(this.multipleClaimIds, 'primary', formData.markSubmitted, formData.printFormat)
        .subscribe((response: any) => {
          this.submitted = false;
          this.dialogPopup.close('Success');
          this.claimService.downLoadFile(response, 'application/pdf', `batchClaims`);
        });
      return null;
    }

    if (!this.isEDIClaim) {
      if (!this.isResubmitClaim) {
        this.claimService.generatePaperClaim(this.claimId, formData.patientInsuranceId, formData.markSubmitted, formData.printFormat)
          .subscribe((response: any) => {
            this.submitted = false;
            this.dialogPopup.close('Success');
            this.claimService.downLoadFile(response, 'application/pdf', `CL${this.claimId}_PaperClaim`)
          });
      } else {
        this.claimService.generatePaperClaim_Secondary(this.claimId, formData.patientInsuranceId, formData.printFormat)
          .subscribe((response: any) => {
            this.submitted = false;
            this.dialogPopup.close('Success');
            this.claimService.downLoadFile(response, 'application/pdf', `CL${this.claimId}_PaperClaim`)
          });
      }
    } else {
      if (!this.isResubmitClaim) {
        // condition for primary payer submit
        if((this.payerPreference || '').toUpperCase() == 'PRIMARY') {
        const claimIds = this.claimId.toString();
        this.claimService.downloadBatchEDIClaims(claimIds)
          .subscribe((response: any) => {
            this.submitted = false;
            this.dialogPopup.close('Success');
            this.claimService.downLoadFile(response, 'text/plain', 'EDI.txt')
          });
        }
        // condition for secondary payer submit
        else {
          this.claimService.generateSingleEDI837_Secondary(this.claimId, formData.patientInsuranceId)
          .subscribe((response: any) => {
            this.submitted = false;
            this.dialogPopup.close('Success');
            this.claimService.downLoadFile(response, 'text/plain', 'EDI.txt')
          });
        }
      } else {
        const reSubmitReasonObj = (this.claimResubmissionReason || []).find(obj => obj.id == formData.resubmissionReason);
        const reason = reSubmitReasonObj && reSubmitReasonObj.resubmissionReason;
        this.claimService.resubmitClaim(this.claimId, formData.patientInsuranceId, reason, formData.payerControlReferenceNumber)
          .subscribe((response: any) => {
            this.submitted = false;
            if (response.statusCode !== 200) {
              this.notifier.notify('error', response.message)
            } else {
              this.dialogPopup.close('Success');
              this.notifier.notify('success', response.message)
            }
          });
      }
    }
  }

  fetchPatientPayers(patientId: number): void {
    // load master data
    this.claimService.getPatientPayers(patientId, this.payerPreference)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200 && Array.isArray(response.data)) {
          this.patientPayers = response.data || [];
        } else {
          this.patientPayers = [];
        }
      });
  }

  fetchMasterData() {
    const masterData = { masterdata: 'CLAIMRESUBMISSIONREASON' }
    this.claimService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response) {
          this.claimResubmissionReason = response.claimResubmissionReason || [];
        } else {
          this.claimResubmissionReason = [];
        }
      })
  }

}
