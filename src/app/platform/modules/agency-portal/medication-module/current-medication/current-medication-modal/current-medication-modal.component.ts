import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, finalize, delay, catchError } from 'rxjs/operators';
import { format } from 'date-fns';
import { CurrentMedicationModel } from '../current-medication.model';
import { MedicationModuleService } from '../../medication-module.service';
import { DialogService } from '../../../../../../shared/layout/dialog/dialog.service';
class MedicationModal {
  "id"?: number;
  "value"?: string;
  "description"?: string = "";
  "strength"?: string;
  "form"?: string;
  "unit"?: string;
}

@Component({
  selector: 'app-current-medication-modal',
  templateUrl: './current-medication-modal.component.html',
  styleUrls: ['./current-medication-modal.component.css']
})
export class CurrentMedicationModalComponent implements OnInit {
  medicationModel: CurrentMedicationModel;
  medicationForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Medication';
  masterFrequencyType: any[];
  patientId: number;
  maxDate = new Date();
  linkedEncounterId: number;
  masterChronicCondition:Array<any>
  masterProvider:Array<any>
  masterMedicationSource: Array<any>
  masterCustomMedicationSource: Array<any>
  strengthArray: any[];
  unitArray: any[];
  formArray: any[];
  isCustomModel: boolean = false;
  // autocomplete
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideMedication: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideDiagnosis: Array<any>;
  selectFilteredServerSideDiagnosis: Array<any>;
  protected _onDestroy = new Subject<void>();

  //construtor
  constructor(private formBuilder: FormBuilder, private medicationDialogModalRef: MatDialogRef<CurrentMedicationModalComponent>,
    private clientService: MedicationModuleService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService, private dialogService: DialogService) {
    this.medicationModel = data;

    //custome header
    if (this.medicationModel.isManualEntry == true) {
      this.headerText = 'Add Custom Medication';
      this.isCustomModel = true;
    }

    //header text updation
    if (this.medicationModel.id != null && this.medicationModel.id > 0)
      this.headerText = 'Edit Medication';
    this.patientId = this.medicationModel.patientId;
    this.linkedEncounterId = this.medicationModel.linkedEncounterId;
    this.selectFilteredServerSideDiagnosis = this.medicationModel.medication ? [{ id: this.medicationModel.medicationId, value: this.medicationModel.medication, }] : [];

    if (this.medicationModel.id != null && this.medicationModel.id > 0) {
      //this.medicationModel.dosageForm = this.medicationModel.dosageForm.toString().trim();
      this._filter(this.medicationModel.medication).subscribe(filteredMembers => {
        this.fetchedFilteredServerSideDiagnosis = filteredMembers; this.filteredServerSideMedication.next(filteredMembers);
        this.selectFilteredServerSideDiagnosis = [];
        this.onEditMedication(this.medicationModel.medication);
        // this.strengthArray = this.medicationModel.dose ? [this.medicationModel.dose] : [];
        // this.formArray = this.medicationModel.dosageForm ? [this.medicationModel.dosageForm] : [];
        // this.unitArray = this.medicationModel.unit ? [this.medicationModel.unit] : [];
        this.medicationForm.controls.dose.patchValue(this.medicationModel.dose ? this.medicationModel.dose.toString().trim() : null);
        this.medicationForm.controls.dosageForm.patchValue(this.medicationModel.dosageForm ? this.medicationModel.dosageForm.toString().trim() : null);
        this.medicationForm.controls.unit.patchValue(this.medicationModel.unit ? this.medicationModel.unit.toString().trim() : null);
      },
        error => {
        });
    }
   

  
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // on initial load
  ngOnInit() {
    this.medicationForm = this.formBuilder.group({
      id: [this.medicationModel.id],
      prescribedDate: [this.medicationModel.prescribedDate],
      dose: [this.medicationModel.dose],
      medicationId: [this.medicationModel.medicationId],
      quantity: [this.medicationModel.quantity],
      daySupply: [this.medicationModel.daySupply],
      frequencyId: [this.medicationModel.frequencyId],
      conditionId: [this.medicationModel.conditionId],
      providerId: [this.medicationModel.providerId],
      refills: [this.medicationModel.refills],
      sourceId: [this.medicationModel.sourceId],
      notes: [this.medicationModel.notes],
      dosageForm: [this.medicationModel.dosageForm],
      unit: [this.medicationModel.unit],
      isManualEntry: [this.medicationModel.isManualEntry],
      medication: [this.medicationModel.medication],
    });
    this.getMasterData();
    this.getPatientPhysicianData();
    this._filter("").subscribe(filteredMembers => {
      this.fetchedFilteredServerSideDiagnosis = filteredMembers; this.filteredServerSideMedication.next(filteredMembers);
    },
      error => {
      });

      this.filterCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(500),
        map(search => {

          // simulate server fetching and filtering data
          if (search.length > 2) {
            return this._filter(search).pipe(
              finalize(() => this.searching = false),
            )
          } else {
            // if no value is present, return null
            return of([]);
          }
          // return this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredMembers => {
        this.searching = false;
        filteredMembers.subscribe(res => { this.fetchedFilteredServerSideDiagnosis = res; this.filteredServerSideMedication.next(res) });
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });

      this._filter("").subscribe(filteredMembers => {
      this.fetchedFilteredServerSideDiagnosis = filteredMembers; this.filteredServerSideMedication.next(filteredMembers);
    },
      error => {
      });
  }
  _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return this.clientService
      .getMasterMedicationByFilter(filterValue)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode != 200)
              return [];
            else
              return (response.data || []).map((mObj: any) => {
                const Obj: MedicationModal = {
                  id: mObj.id,
                  value: `${mObj.value}`,
                  strength: `${mObj.key}`,
                  form: `${mObj.form}`,
                  unit: `${mObj.unit}`,
                }
                return Obj;
              });
          }),
        catchError(_ => {
          return [];
        })
      );
  }
  get getSlectFilteredServerSideDiagnosis() {
    return (this.selectFilteredServerSideDiagnosis || []).filter(x => {
      if ((this.fetchedFilteredServerSideDiagnosis || []).findIndex(y => y.id == x.id) > -1)
        return false;
      else
        return true;
    })
  }
  onMedicationSelect(id) {
    let diagnosisArray = this.fetchedFilteredServerSideDiagnosis || [];
    diagnosisArray = [...this.selectFilteredServerSideDiagnosis, ...diagnosisArray];
    diagnosisArray = Array.from(new Set(diagnosisArray.map(s => s)));
    this.selectFilteredServerSideDiagnosis = diagnosisArray.filter(x => x.id == id);

    let medicationNmae = this.selectFilteredServerSideDiagnosis[0].value;

    this.strengthArray = [];
    this.formArray = [];
    this.unitArray = [];
    this.medicationForm.controls.dose.patchValue(null);
    this.medicationForm.controls.dosageForm.patchValue(null);
    this.medicationForm.controls.unit.patchValue(null);
    this.getPatientCurrentMedicationStrengthData(medicationNmae);
    this.getPatientCurrentMedicationUnitData(medicationNmae);
    this.getPatientCurrentMedicationformDoseData(medicationNmae);
    //var strgthArray = diagnosisArray.filter(x => x.id == this.selectFilteredServerSideDiagnosis[0].id && x.strength != 'undefined') || [];
    //if (strgthArray.length > 0) {
    //   var Arraylist = strgthArray[0]['strength'].toString().split(',');
    //  var trimlist = Arraylist.map(Function.prototype.call, String.prototype.trim);
    //  this.strengthArray = trimlist.filter((n, i) => trimlist.indexOf(n) === i);
    //  this.strengthArray.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1));
    //}
    //var unitStrgthArray = diagnosisArray.filter(x => x.id == this.selectFilteredServerSideDiagnosis[0].id && x.unit != 'undefined') || [];
    //if (unitStrgthArray.length > 0) {
    //  var unitStrgthArraylist = unitStrgthArray[0]['unit'].toString().split(',');
    //  var Unittrimlist = unitStrgthArraylist.map(Function.prototype.call, String.prototype.trim);
    //  this.unitArray = Unittrimlist.filter((n, i) => Unittrimlist.indexOf(n) === i);
    //  this.unitArray.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1));
    //}
    //var formArraylist = diagnosisArray.filter(x => x.id == this.selectFilteredServerSideDiagnosis[0].id && x.form != 'undefined') || [];
    //if (formArraylist.length > 0) {
    //  var unique = formArraylist[0]['form'].toString().split(',');
    //  this.formArray = unique.filter((v, i, a) => a.indexOf(v) === i);
    //}
    
  }

  getPatientCurrentMedicationStrengthData(medicationName) {
    this.clientService.getPatientCurrentMedicationStrengthData(medicationName).subscribe((response: any) => {
      if (response.statusCode === 200 ) {
        this.strengthArray= response.data;
      } else {
        this.strengthArray = [];
      }
     
    });
  }

  getPatientCurrentMedicationUnitData(medicationName) {
    this.clientService.getPatientCurrentMedicationUnitData(medicationName).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.unitArray = response.data;
      } else {
        this.unitArray = [];
      }
    });
  }

  getPatientCurrentMedicationformDoseData(medicationName) {
    this.clientService.getPatientCurrentMedicationformDoseData(medicationName).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.formArray = response.data;
      } else {
        this.formArray = [];
      }
    });
  }

  onEditMedication(name) {
    let diagnosisArray = this.fetchedFilteredServerSideDiagnosis || [];
    diagnosisArray = [...this.selectFilteredServerSideDiagnosis, ...diagnosisArray];
    diagnosisArray = Array.from(new Set(diagnosisArray.map(s => s)));
    this.selectFilteredServerSideDiagnosis = diagnosisArray.filter(x => x.value == name);

    this.medicationForm.controls.medicationId.patchValue(this.selectFilteredServerSideDiagnosis[0].id);

    this.strengthArray = [];
    this.formArray = [];
    this.unitArray = [];
    this.medicationForm.controls.dose.patchValue(null);
    this.medicationForm.controls.dosageForm.patchValue(null);
    this.medicationForm.controls.unit.patchValue(null);

    this.getPatientCurrentMedicationStrengthData(name);
    this.getPatientCurrentMedicationUnitData(name);
    this.getPatientCurrentMedicationformDoseData(name);
    //var strgthArray = diagnosisArray.filter(x => x.id == this.selectFilteredServerSideDiagnosis[0].id && x.strength != 'undefined') || [];
    //if (strgthArray.length > 0) {
    //  var Arraylist = strgthArray[0]['strength'].toString().split(',');
    //  var trimlist = Arraylist.map(Function.prototype.call, String.prototype.trim);
    //  this.strengthArray = trimlist.filter((n, i) => trimlist.indexOf(n) === i);
    //  this.strengthArray.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1));
    //}
    //var unitStrgthArray = diagnosisArray.filter(x => x.id == this.selectFilteredServerSideDiagnosis[0].id && x.unit != 'undefined') || [];
    //if (unitStrgthArray.length > 0) {
    //  var unitStrgthArraylist = unitStrgthArray[0]['unit'].toString().split(',');
    //  var Unittrimlist = unitStrgthArraylist.map(Function.prototype.call, String.prototype.trim);
    //  this.unitArray = Unittrimlist.filter((n, i) => Unittrimlist.indexOf(n) === i);
    //  this.unitArray.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1));
    //}
    //var formArraylist = diagnosisArray.filter(x => x.id == this.selectFilteredServerSideDiagnosis[0].id && x.form != 'undefined') || [];
    //if (formArraylist.length > 0) {
    //  var unique = formArraylist[0]['form'].toString().split(',');
    //  var uniquetrimlist = unique.map(Function.prototype.call, String.prototype.trim);
    //  this.formArray = uniquetrimlist.filter((v, i, a) => a.indexOf(v) === i);
    //}

  }
  // get all the controls
  get formControls() { return this.medicationForm.controls; }
  getMasterData() {
    let data = "FREQUENCYTYPE,MASTERCHRONICCONDITION,MEDICATIONSOURCE";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterFrequencyType = response.masterFrequencyType != null ? response.masterFrequencyType : [];
        this.masterChronicCondition = response.masterChronicCondition != null ? response.masterChronicCondition : [];
        this.masterMedicationSource = response.masterMedicationSource != null ? response.masterMedicationSource : [];
        this.masterCustomMedicationSource = this.masterMedicationSource.filter(x => x.value == 'Self Reported');
      }
    });
  }

  resetFormValue(key: string) {
    this.medicationForm.get(key).patchValue(null);
  }
  //submit the form
  onSubmit(event: any) {
    if (!this.medicationForm.invalid) {
      if (this.isCustomModel == true) {
        this.dialogService.confirm(`You are adding a manual medication. Once complete, you will not be able to modify the Medication, Medication Form, Dose or Unit fields. You will be able to edit all other fields after saving the entry. Would you like to proceed?`).subscribe((result: any) => {
          if (result == true) {
            this.submitted = true;
            this.medicationModel = this.medicationForm.value;
            this.medicationModel.patientId = this.patientId;
            this.medicationModel.prescribedDate = this.medicationModel.prescribedDate ? format(this.medicationModel.prescribedDate, 'YYYY-MM-DD') : null;
            this.medicationModel.linkedEncounterId = this.linkedEncounterId;
            this.clientService.createCurrentMedication(this.medicationModel).subscribe((response: any) => {
              this.submitted = false;
              if (response != null && response.statusCode == 200) {
                this.notifier.notify('success', response.message)
                this.closeDialog('SAVE');
              } else {
                this.notifier.notify('error', response.message)
              }
            });
          }
        })
      }
      else {
        this.submitted = true;
        this.medicationModel = this.medicationForm.value;
        this.medicationModel.patientId = this.patientId;
        this.medicationModel.prescribedDate = this.medicationModel.prescribedDate ? format(this.medicationModel.prescribedDate, 'YYYY-MM-DD') : null;
        this.medicationModel.linkedEncounterId = this.linkedEncounterId;
        this.clientService.createCurrentMedication(this.medicationModel).subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message)
            this.closeDialog('SAVE');
          } else {
            this.notifier.notify('error', response.message)
          }
        });
      }
    }
  }
  getPatientPhysicianData() {
    this.clientService.getPatientPhysicianData(this.patientId)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.masterProvider = response.data;
          } else {
            this.masterProvider = [];
          }
        });
  }
  //to close popup
  closeDialog(action: string): void {
    this.medicationDialogModalRef.close(action);
  }

}
