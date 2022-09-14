import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-sign-dailog',
  templateUrl: './sign-dailog.component.html',
  styleUrls: ['./sign-dailog.component.css']
})
export class SignDailogComponent implements OnInit {
  signForm: FormGroup;
  SignatoryLists: Array<any>;
  StaffLists: Array<any>;
  clientDetails: any;
  signDataUrl : string;
  submitted: boolean;
  isShowSignatory: boolean;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
 
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'dotSize': parseFloat('0.1'),
    'minWidth': 5,
    'canvasWidth': 800,
    'canvasHeight': 300
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogPopup: MatDialogRef<SignDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isShowSignatory = data.isShowSignatory == true;
    this.signDataUrl = null;
    this.submitted =false;
    this.SignatoryLists = data.SignatoryLists || [];
    this.StaffLists = data.staffsList || [];
    this.clientDetails = data.clientDetails || null;
   }

  ngOnInit() {

    let selectedSignatory = (this.SignatoryLists || []).length == 1 ? this.SignatoryLists[0] : null,
      selectedStaff = (this.StaffLists || []).length == 1 ? this.StaffLists[0].id : null;


    this.signForm = this.formBuilder.group({
      'Signatory': [selectedSignatory],
      'StaffID': [selectedStaff],
      'Client': [this.clientDetails && this.clientDetails.value],
      'Guardian': ['']
    })
  }

  get formControls() {
    return this.signForm.controls;
  }

  onSubmit() {
    if (this.signForm.invalid || !this.signDataUrl) {
      return null;
    }

    const { StaffID, Signatory, Guardian } = this.signForm.value;

    let clientName = this.clientDetails && this.clientDetails.value,
        staffName = this.StaffLists.find(obj => obj.id == StaffID) && this.StaffLists.find(obj => obj.id == StaffID).value,
        guardianName = Guardian;

    const result = {
      'Signatory': Signatory,
      'name': Signatory == this.SignatoryLists[0] ? staffName : Signatory == this.SignatoryLists[1] ? clientName : guardianName,
      'bytes': this.signDataUrl,
    }
    this.dialogPopup.close(result);
  }

  onClose() {
    this.dialogPopup.close();
  }

  onClear() {
    this.signaturePad.clear();
    this.signDataUrl = null;
  }

  // sign pad
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
    this.signDataUrl = this.signaturePad.toDataURL();
  }
 
}
