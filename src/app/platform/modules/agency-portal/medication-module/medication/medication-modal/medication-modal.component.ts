import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MedicationModel, MedicationDataModel } from '../medication.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, finalize, delay, catchError } from 'rxjs/operators';
import { format } from 'date-fns';
import { MedicationModuleService } from '../../medication-module.service';
class MedicationModal {
  "id"?: number;
  "value"?: string;
  "description"?: string = "";
}

@Component({
  selector: 'app-medication-modal',
  templateUrl: './medication-modal.component.html',
  styleUrls: ['./medication-modal.component.css']
})
export class MedicationModalComponent implements OnInit {
  medicationModel: MedicationDataModel;
  medicationForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Medication';
  masterFrequencyType: any[];
  patientId: number;
  maxDate = new Date();
  linkedEncounterId: number;

  // autocomplete
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideMedication: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideDiagnosis: Array<any>;
  selectFilteredServerSideDiagnosis: Array<any>;
  protected _onDestroy = new Subject<void>();

  //construtor
  constructor(private formBuilder: FormBuilder, private medicationDialogModalRef: MatDialogRef<MedicationModalComponent>,
    private clientService: MedicationModuleService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.medicationModel = data;

    //header text updation
    if (this.medicationModel.id != null && this.medicationModel.id > 0)
      this.headerText = 'Edit Medication';
    this.patientId = this.medicationModel.patientId;
    this.linkedEncounterId = this.medicationModel.linkedEncounterId;
    this.selectFilteredServerSideDiagnosis = this.medicationModel.masterMedicationId ? [{ id: this.medicationModel.masterMedicationId, value: this.medicationModel.drugName }] : [];
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // on initial load
  ngOnInit() {
    this.medicationForm = this.formBuilder.group({
      id: [this.medicationModel.id],
      fillDate: [this.medicationModel.fillDate],
      prescriberNPI: [this.medicationModel.prescriberNPI],
      masterMedicationId: [this.medicationModel.masterMedicationId],
      pharmacy: [this.medicationModel.pharmacy],
      supplyDays: [this.medicationModel.supplyDays],
      quantity: [this.medicationModel.quantity]
    });
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
        debounceTime(200),
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
                  value: `${mObj.value}`
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

  }

  // get all the controls
  get formControls() { return this.medicationForm.controls; }

  //submit the form
  onSubmit(event: any) {
    if (!this.medicationForm.invalid) {
      this.submitted = true;
      this.medicationModel = this.medicationForm.value;
      this.medicationModel.patientId = this.patientId;
      this.medicationModel.fillDate = this.medicationModel.fillDate ? format(this.medicationModel.fillDate, 'YYYY-MM-DD'):null;
      this.medicationModel.linkedEncounterId = this.linkedEncounterId;
      this.clientService.createMedication(this.medicationModel).subscribe((response: any) => {
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

  //to close popup
  closeDialog(action: string): void {
    this.medicationDialogModalRef.close(action);
  }

}
