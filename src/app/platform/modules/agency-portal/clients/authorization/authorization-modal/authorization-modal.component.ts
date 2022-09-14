import { Component, OnInit, Inject } from '@angular/core';
import { ClientsService } from '../../clients.service';
import { AuthModel, AuthProceduresModel } from '../authorization.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResponseModel } from '../../../../core/modals/common-model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';

@Component({
  selector: 'app-authorization-modal',
  templateUrl: './authorization-modal.component.html',
  styleUrls: ['./authorization-modal.component.css']
})
export class AuthorizationModalComponent implements OnInit {
  serviceCodeErrorMessage:string= "Please select service code";
  isModifiers:boolean=true;
  patientId: number;
  payerPreference: string = "primary";
  date: Date;
  payerId: number = null;
  patientInsuranceId: number;
  authorizationForm: FormGroup;
  submitted: boolean = false;

  //master models
  masterAuthorizedProcedure: any[];
  patientPayers: any = [];
  serviceCodeModifiers: any[];  
  serviceCodes: any[];
  authModel: AuthModel;
  authorizationId: number;
  headerText: string = 'Add Authorization';

  constructor(private formBuilder: FormBuilder, private notifier: NotifierService, private authorizationDialogModalRef: MatDialogRef<AuthorizationModalComponent>, private clientsService: ClientsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.authModel = data;
    this.authorizationId = data.id || null;
    this.patientId = this.authModel.patientID;
    this.patientInsuranceId = this.authModel.patientInsuranceId;

    //update header text
    if (this.authModel.id != null && this.authModel.id > 0)
      this.headerText = 'Edit Authorization';
    else
      this.headerText = 'Add Authorization';

  }

  get authorizationProcedures() {
    return this.authorizationForm.get('authorizationProcedures') as FormArray;
  }

  addAuthorizationProcedures(authProcModel?: AuthProceduresModel) {    
    let authCPTCodes = [], authCPTModifiers = [];
    if(authProcModel && authProcModel.authProcedureCPT) {
      authCPTCodes = authProcModel.authProcedureCPT.map(obj => obj.cptid);
      if (authProcModel.authProcedureCPT.length == 1) {
        authCPTModifiers = (authProcModel.authProcedureCPT[0].authProcedureCPTModifiers || []).map(obj => obj.modifier);
      }      
    }
    authProcModel = authProcModel == null ? new AuthProceduresModel() : authProcModel;
    let authProcedureControls = this.authorizationProcedures;
    authProcedureControls.push(this.formBuilder.group({
      id: [authProcModel.id],
      unit: [authProcModel.unit],
      typeID: [authProcModel.typeID],
      authProcedureCPT: [authCPTCodes],
      authProcedureCPTModifiers: [authCPTModifiers],
    }))
  }

  removeAuthorizationProcedures(index: number) {
    this.authorizationProcedures.removeAt(index)
  }

  //get the form controls on html page
  get formControls() { return this.authorizationForm.controls; }

  ngOnInit() {
    this.authorizationForm = this.formBuilder.group({
      id: [this.authModel.id],
      authorizationTitle: [this.authModel.authorizationTitle],
      authorizationNumber: [this.authModel.authorizationNumber],
      startDate: [this.authModel.startDate],
      endDate: [this.authModel.endDate],
      notes: [this.authModel.notes],
      payerId: [this.payerId],
      patientInsuranceId: [this.authModel.patientInsuranceId],
      authorizationProcedures: this.formBuilder.array([])
    });


    // initialize modifier modal
    if (this.authModel.authorizationProcedures && this.authModel.authorizationProcedures.length) {
      this.authModel.authorizationProcedures.forEach(obj => {
        this.addAuthorizationProcedures(obj);
      })
    } else {
      this.addAuthorizationProcedures();
    }

    //load master data
    this.getMasterData();

    //load payer of patient
    this.getPayerByPatient();

    //get patient payer's service code and modifiers
    // this.getPatientPayerServiceCodesAndModifiers();

  }

  getMasterData() {
    this.clientsService.getMasterData('authorizedprocedure')
      .subscribe((response: any) => {
        if (response) {
          this.masterAuthorizedProcedure = response.masterAuthorizedProcedure || [];
        } else {
          this.masterAuthorizedProcedure = [];
        }
      })
  }

  getPayerByPatient() {
    this.clientsService.getPayerByPatient(this.patientId, "PRIMARY").subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.patientPayers = response.data;
        this.payerId = this.patientPayers[0].insuranceCompanyId;
        this.patientInsuranceId = this.patientPayers[0].patientInsuranceId;

        if(this.authorizationId) {
          this.getPatientPayerServiceCodesAndModifiers();
        }
      }
    });
  }

  getPatientPayerServiceCodesAndModifiers() {
    this.clientsService.getPatientPayerServiceCodesAndModifiers(this.patientId, this.payerId, this.patientInsuranceId).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.serviceCodeModifiers = response.data.ServiceCodeModifiers || [];
        this.serviceCodes = response.data.ServiceCodes || [];
      } else {
        this.serviceCodeModifiers = [];
        this.serviceCodes = [];
      }
    })
  }

  onPayerSelected(event: any) {
    const selectedValue = event.value;
    this.getPatientPayerServiceCodesAndModifiers();
  }

  
  onTest(event: any,index :number) {
    if (event.value && event.value.length == 1) {
      
      this.authorizationProcedures.controls[index].get('authProcedureCPTModifiers').enable();
    }
    else
    {
      this.authorizationProcedures.controls[index].get('authProcedureCPTModifiers').patchValue([]);
      this.authorizationProcedures.controls[index].get('authProcedureCPTModifiers').disable()
    }
  }

  //close popup
  closeDialog(action: string): void {
    this.authorizationDialogModalRef.close(action);
  }


  //submit for create update of vitals
  onSubmit(event: any) {
    if (!this.authorizationForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      // this.authModel = this.authorizationForm.value;
      // this.authModel.patientID = this.patientId;

      const { authorizationTitle,authorizationNumber,startDate,endDate,notes,payerId, authorizationProcedures } = this.authorizationForm.value;

      let authProcedures: AuthProceduresModel[] = [];
      let formAuthProcedures = authorizationProcedures || [];
      let procedures = this.authModel.authorizationProcedures;
      if (procedures && procedures.length) {
        // set all procedures and cpts to IsDeleted=true for updation in Arrays.
        authProcedures = procedures.map((Obj) => {
          return {
            'id': Obj.id,
            'authorizationId': Obj.authorizationId,
            'authProcedureCPT': Obj.authProcedureCPT.map((cpt) => {
              return {
                'id': cpt.id,
                'cptid': cpt.cptid,
                'authorizationProceduresId': cpt.authorizationProceduresId,
                'isDeleted': true,
                'authProcedureCPTModifiers': (cpt.authProcedureCPTModifiers || []).map((modifier) => {
                  return {
                    'id': modifier.id,
                    'modifier': modifier.modifier,
                    'authProcedureCPTLinkId': modifier.authProcedureCPTLinkId,
                    'isDeleted': true,
                  };
                }),
              };
            }),
            'unit': Obj.unit,
            'typeID': Obj.typeID,
            'isDeleted': true
          };
        });
      };
      formAuthProcedures.forEach((proc) => {
        // update case for auth procedures ------
        let Procedure = authProcedures.find((Obj) => Obj.id === proc.id && Obj.isDeleted);
        if (Procedure) {
          let index = authProcedures.indexOf(Procedure);
          let authProceduresCptLinks = Procedure.authProcedureCPT;
          proc.authProcedureCPT.forEach((cpt, i) => {
            let procedureCpt = authProceduresCptLinks.find((obj) => obj.cptid === cpt && obj.isDeleted);
            let cptIndex = authProceduresCptLinks.indexOf(procedureCpt);

            if (procedureCpt) {
              let authProcedureCPTModifiers = procedureCpt.authProcedureCPTModifiers || [];
              (proc.authProcedureCPTModifiers || []).forEach((cptModifier) => {
                let procedureCptModifier = authProcedureCPTModifiers.find((mobj) => mobj.modifier === cptModifier && mobj.isDeleted);
                let modifierIndex = authProcedureCPTModifiers.indexOf(procedureCptModifier);
                if (procedureCptModifier) {
                  // while updating on the existing Procedure CPT code modifiers ...
                  authProcedureCPTModifiers[modifierIndex] = {
                    'id': procedureCptModifier.id,
                    'modifier': procedureCptModifier.modifier,
                    'authProcedureCPTLinkId': procedureCptModifier.authProcedureCPTLinkId,
                    'isDeleted': false,
                  };
                } else {
                  // while adding new Procedure CPT code modifiers ...
                  authProcedureCPTModifiers.push({
                    'id': 0,
                    'modifier': cptModifier,
                    'authProcedureCPTLinkId': 0,
                    'isDeleted': false,
                  });
                }
              });

              // while updating on the existing Procedure CPT codes ...
              authProceduresCptLinks[cptIndex] = {
                'id': procedureCpt.id,
                'cptid': procedureCpt.cptid,
                'authorizationProceduresId': procedureCpt.authorizationProceduresId,
                'isDeleted': false,
                'authProcedureCPTModifiers': authProcedureCPTModifiers,
              };
            } else {
              let authProcedureCPTModifiers = [];
              (proc.modifiers || []).forEach((cptModifier) => {
                // while adding new Procedure CPT code modifiers ...
                authProcedureCPTModifiers.push({
                  'id': 0,
                  'modifier': cptModifier,
                  'authProcedureCPTLinkId': 0,
                  'isDeleted': false,
                });
              });

              // while adding new Procedure CPT codes ...
              authProceduresCptLinks.push({
                'id': 0,
                'cptid': cpt,
                'authorizationProceduresId': 0,
                'isDeleted': false,
                'authProcedureCPTModifiers': authProcedureCPTModifiers,
              });
            }
          });
          // while updating on the existing Authorization Procedure ...
          authProcedures[index] = {
            'id': Procedure.id,
            'authorizationId': Procedure.authorizationId,
            'authProcedureCPT': authProceduresCptLinks,
            'unit': proc.unit,
            'typeID': proc.typeID,
            'isDeleted': false,
          };
        } else {
          // while adding new on the Authorization Procedure ...
          authProcedures.push({
            'id': 0,
            'authorizationId': 0,
            'authProcedureCPT': proc.authProcedureCPT.map((cpt, i) => {
              return {
                'id': 0,
                'cptid': cpt,
                'authorizationProceduresId': 0,
                'isDeleted': false,
                'AuthProcedureCPTModifiers': (proc.authProcedureCPTModifiers || []).map((modifier) => {
                  return {
                    'id': 0,
                    'authProcedureCPTLinkId': 0,
                    'modifier': modifier,
                    'isDeleted': false,
                  };
                }),
              };
            }),
            'unit': proc.unit,
            'typeID': proc.typeID,
            'isDeleted': false,
          });
        }
      });
      let authorizationData: AuthModel = {
        'id': this.authorizationId,
        'patientID': this.patientId,
        'startDate': format(startDate, 'YYYY-MM-DD'),
        'endDate': format(endDate, 'YYYY-MM-DD'),
        'authorizationTitle': authorizationTitle,
        'authorizationNumber': authorizationNumber,
        'patientInsuranceId': this.patientInsuranceId,
        'notes': notes,
        'authorizationProcedures': authProcedures,
      };
      this.clientsService.createAuthorization(authorizationData).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
            this.closeDialog('save');
          else if (clickType == "SaveAddMore") {
            this.authorizationForm.reset();
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
}
