import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { DiagnosisDataModel } from '../diagnosis.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, tap, finalize, map, catchError, filter, takeUntil, delay } from 'rxjs/operators'; 
import { ClientsService } from '../../clients.service';

class DiseaseModal {
  "id"?: number;
  "value"?: string;
  "code"?: string = "";
  "description"?: string = "";
}

@Component({
  selector: 'app-diagnosis-modal',
  templateUrl: './diagnosis-modal.component.html',
  styleUrls: ['./diagnosis-modal.component.css']
})
export class DiagnosisModalComponent implements OnInit {
  statusList: any[];
  diagnosisModel: DiagnosisDataModel;
  diagnosisForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Diagnosis';
  filteredDiagnosis$: Observable<DiseaseModal[]>;
  isloadingDiagnosis: boolean;
  patientId: number;
  maxDate = new Date();
  linkedEncounterId: number;
  // autocomplete
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideDiagnosis: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideDiagnosis: Array<any>;
  selectFilteredServerSideDiagnosis: Array<any>;
  protected _onDestroy = new Subject<void>();

  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder, private diagnosisDialogModalRef: MatDialogRef<DiagnosisModalComponent>,
    private clientService: ClientsService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.diagnosisModel = data;
    this.refreshGrid.subscribe(data.refreshGrid);

    if (this.diagnosisModel.id != null && this.diagnosisModel.id > 0)
      this.headerText = 'Edit Diagnosis';
    else
      this.headerText = 'Add Diagnosis';

    this.patientId = this.diagnosisModel.patientID;
    this.linkedEncounterId = this.diagnosisModel.linkedEncounterId;
    this.statusList = [{ id: true, value: 'Active' }, { id: false, value: 'Inactive' }];
    this.selectFilteredServerSideDiagnosis = this.diagnosisModel.icdid ? [{ id: this.diagnosisModel.icdid, value: this.diagnosisModel.diagnosisName }] : [];

    this.isloadingDiagnosis = false;
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  ngOnInit() {
    this.diagnosisForm = this.formBuilder.group({
      id: [this.diagnosisModel.id],
      icdid: [this.diagnosisModel.icdid],
      isActive: [this.diagnosisModel.isActive],
      diagnosisDate: [this.diagnosisModel.diagnosisDate],
      resolveDate: [this.diagnosisModel.resolveDate]
    });

    this._filter("").subscribe(filteredMembers => {
      this.fetchedFilteredServerSideDiagnosis = filteredMembers; this.filteredServerSideDiagnosis.next(filteredMembers);
    },
      error => {
        // no errors in our simulated example
        // this.searching = false;
        // handle error...
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
        filteredMembers.subscribe(res => { this.fetchedFilteredServerSideDiagnosis = res; this.filteredServerSideDiagnosis.next(res) });
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }

  get formControls() { return this.diagnosisForm.controls; }

  closeDialog(action: string): void {
    this.diagnosisDialogModalRef.close(action);
  }
  _filter(value: string): Observable<any> {
    const filterValue = value.toLowerCase();
    return this.clientService
      .getMasterICDCodesByFilter(filterValue)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode != 200)
              return [];
            else
              return (response.data || []).map((dObj: any) => {
                const Obj: DiseaseModal = {
                  id: dObj.id,
                  value: `${dObj.code} ( ${(dObj.description || '').trim()} )`
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

  onDiagnosisSelect(id) {
    let diagnosisArray = this.fetchedFilteredServerSideDiagnosis || [];
    diagnosisArray = [...this.selectFilteredServerSideDiagnosis, ...diagnosisArray];
    diagnosisArray = Array.from(new Set(diagnosisArray.map(s => s)));
    this.selectFilteredServerSideDiagnosis = diagnosisArray.filter(x => x.id == id);

  }
  onSubmit(event: any) {
    if (!this.diagnosisForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      const formValues = this.diagnosisForm.value;
      this.diagnosisModel = formValues;
      this.diagnosisModel.patientID = this.patientId;
      this.diagnosisModel.diagnosisDate = format(this.diagnosisModel.diagnosisDate, 'YYYY-MM-DD');
      this.diagnosisModel.resolveDate = this.diagnosisModel.isActive ? null : format(this.diagnosisModel.resolveDate, 'YYYY-MM-DD');
      this.diagnosisModel.linkedEncounterId = this.linkedEncounterId;
      this.clientService.createDiagnosis(this.diagnosisModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }

}
