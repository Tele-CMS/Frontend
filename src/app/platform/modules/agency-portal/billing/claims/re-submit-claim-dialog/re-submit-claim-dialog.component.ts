import { Component, OnInit, Inject } from '@angular/core';
import { ClaimsService } from '../claims.service';
import { NotifierService } from 'angular-notifier';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-re-submit-claim-dialog',
  templateUrl: './re-submit-claim-dialog.component.html',
  styleUrls: ['./re-submit-claim-dialog.component.css']
})
export class ReSubmitClaimDialogComponent implements OnInit {
  claimIds: Array<number>;
  allClaims: Array<any>;
  submitted: boolean = false;
  claimResubmissionReason: Array<any>;
  constructor(
    private claimService: ClaimsService,
    private notifier: NotifierService,
    public dialogPopup: MatDialogRef<ReSubmitClaimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.claimIds = data || [];
    this.allClaims = [];
    this.claimResubmissionReason = [];
   }

  ngOnInit() {
    this.fetchMasterData();
  }

  onClose(): void {
    this.dialogPopup.close();
  }


  onSubmit(): void {
    this.submitted = true;
    if(!this.allClaims.length) {
      return null;
    }
    const postData = this.allClaims.map(obj => {
      let reasonObj = (this.claimResubmissionReason || []).find((reasonObj) => reasonObj.id == obj.resubmissionReason);
      return {
        claimId: obj.claimId,
        resubmissionReason: reasonObj && reasonObj.resubmissionReason,
        payerControlReferenceNumber: (reasonObj.resubmissionReason != 'OR') ? obj.payerControlReferenceNumber : null,
      };
    });
    this.claimService.resubmitBatchEDI837(postData)
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

  onChangeResubmisionReason(value: number) {
    this.updateAllClaims(value);
  }

  updateAllClaims(defaulSelectedId: number) {
    let tempArray = [];
    (this.claimIds || []).forEach(claimid => {
      tempArray.push({
        claimId: claimid,
        resubmissionReason: defaulSelectedId || '',
        payerControlReferenceNumber: ''
      })
    })
    this.allClaims = tempArray;
  }

  fetchMasterData() {
    const masterData = { masterdata: 'CLAIMRESUBMISSIONREASON' }
    this.claimService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response) {
          this.claimResubmissionReason = response.claimResubmissionReason || [];
          const defaultSelected = this.claimResubmissionReason.find(obj => obj.resubmissionReason == 'OR');
          this.updateAllClaims(defaultSelected && defaultSelected.id);
        } else {
          this.claimResubmissionReason = [];
        }
      })
  }

}
