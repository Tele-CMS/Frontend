import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientsService } from '../../clients.service';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, finalize, delay, catchError } from 'rxjs/operators';
import { format } from "date-fns";
import { MedicationModel } from '../../medication/medication.model';
import { PrescriptionModel } from '../prescription.model';

class DrugModelData {
  "id"?: number;
  "drugName"?: string;
  "value"?: string;
}

@Component({
  selector: 'app-prescription-modal',
  templateUrl: './prescription-modal.component.html',
  styleUrls: ['./prescription-modal.component.css']
})
export class PrescriptionModalComponent implements OnInit {
  prescriptionModel: PrescriptionModel;
  prescriptionForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Prescription';
  masterFrequencyType: any[];
  masterPrescriptionType: any[];
  patientId: number;
  createdBy:number;
  createdDate:string;
  maxDate = new Date();

  // autocomplete
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideprescription: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideprescription: Array<any>;
  selectFilteredServerSideprescription: Array<any>;
  selectstrengthdoseServerSideprescription: Array<any>;
  protected _onDestroy = new Subject<void>();

  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  //construtor
  constructor(private formBuilder: FormBuilder, private medicationDialogModalRef: MatDialogRef<PrescriptionModalComponent>,
    private clientService: ClientsService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.prescriptionModel = data.allergy;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.prescriptionModel.patientId;

    //header text updation
    if (this.prescriptionModel.id != null && this.prescriptionModel.id > 0)
      this.headerText = 'Edit Prescription';
    else
      this.headerText = 'Add Prescription';
    this.patientId = this.prescriptionModel.patientId;
    this.createdBy=this.prescriptionModel.createdBy;
    this.createdDate=this.prescriptionModel.createdDate;
    //this.selectFilteredServerSideprescription = this.prescriptionModel.id ? [{ id: this.prescriptionModel.masterMedicationId, value: this.prescriptionModel.medicine }] : [];
    this.selectFilteredServerSideprescription = this.prescriptionModel.id ? [{ id: this.prescriptionModel.id, value: this.prescriptionModel.id }] : [];
  }


  // on initial load
  ngOnInit() {
    this.prescriptionForm = this.formBuilder.group({
      id: [this.prescriptionModel.id],
      dose: [this.prescriptionModel.dose],
      endDate: [this.prescriptionModel.endDate],
      frequencyID: [this.prescriptionModel.frequencyID],
      medicine: [this.prescriptionModel.medicine],
      startDate: [this.prescriptionModel.startDate],
      strength: [this.prescriptionModel.strength],
      masterMedicationId: [this.prescriptionModel.masterMedicationId],
      duration: [this.prescriptionModel.duration],
      notes: [this.prescriptionModel.notes],
      drugID: [this.prescriptionModel.drugID],
      directions:[this.prescriptionModel.directions]
    });
    this.getMasterData();

    this._filter("").subscribe(filteredMembers => {
      this.fetchedFilteredServerSideprescription = filteredMembers; this.filteredServerSideprescription.next(filteredMembers);
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
        filteredMembers.subscribe(res => { this.fetchedFilteredServerSideprescription = res; this.filteredServerSideprescription.next(res) });
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
      .getMasterPrescriptionDrugsByFilter(filterValue)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode != 200)
              return [];
            else
              return (response.data || []).map((dObj: any) => {
                
                const Obj: DrugModelData = {
                  id: dObj.id,
                  value: `${(dObj.drugName || '')}`
                }
                return Obj;
              });
          }),
        catchError(_ => {
          return [];
        })
      );
  }
  
  get getSlectFilteredServerSideMedication() {
    return (this.selectFilteredServerSideprescription || []).filter(x => {
      if ((this.fetchedFilteredServerSideprescription || []).findIndex(y => y.id == x.id) > -1)
        return false;
      else
        return true;
    })
  }
  
  //call master data for drop down
  getMasterData() {
    let data = "FREQUENCYTYPE,PRESCRIPTIONTYPE";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        
        this.masterFrequencyType = response.masterFrequencyType != null ? response.masterFrequencyType : [];
        this.masterPrescriptionType=response.masterPrescriptionDrugs != null ? response.masterPrescriptionDrugs : [];
      }
    });
  }

  // get all the controls
  get formControls() { return this.prescriptionForm.controls; }

  //submit the form
  onSubmit(event: any) {
    if (!this.prescriptionForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.prescriptionModel = this.prescriptionForm.value;
      this.prescriptionModel.patientId = this.patientId;
      this.prescriptionModel.createdBy = this.createdBy;
      this.prescriptionModel.createdDate=this.createdDate;
      this.prescriptionModel.startDate =  format(this.prescriptionModel.startDate, 'YYYY-MM-DD'),
      this.prescriptionModel.endDate = format(this.prescriptionModel.endDate, 'YYYY-MM-DD'),
      this.clientService.createPrescription(this.prescriptionModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Save")
            this.closeDialog('SAVE');
          else if (clickType == "SaveAddMore") {
            
            this.refreshGrid.next();
            this.prescriptionForm.reset();
           }
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

getPrescriptionDrugList(){
  this.clientService.getPrescriptionDrugList(1)
  .subscribe((response: any) => {
    if (response.statusCode !== 200) {
      this.selectFilteredServerSideprescription = [];
    } else {
      this.selectFilteredServerSideprescription = response.data;
    }
  })
}
  

onPrescriptionSelect(id) {
    let diagnosisArray = this.masterPrescriptionType || [];
    diagnosisArray = Array.from(new Set(diagnosisArray.map(s => s)));
    this.selectFilteredServerSideprescription= diagnosisArray.filter(x => x.id == id);
    this.prescriptionForm.patchValue({
      strength: this.selectFilteredServerSideprescription[0].strength,
      dose: this.selectFilteredServerSideprescription[0].dose,
   });

  }

  onprescriptSelect(id) {
    
    let diagnosisArray = this.fetchedFilteredServerSideprescription || [];
    diagnosisArray = [...this.selectFilteredServerSideprescription, ...diagnosisArray];
    diagnosisArray = Array.from(new Set(diagnosisArray.map(s => s)));
    this.selectFilteredServerSideprescription = diagnosisArray.filter(x => x.id == id);

    let strengthdoseArray = this.masterPrescriptionType || [];
    this.selectstrengthdoseServerSideprescription= strengthdoseArray.filter(x => x.id == id);
    this.prescriptionForm.patchValue({
      strength: this.selectstrengthdoseServerSideprescription[0].strength,
      dose: this.selectstrengthdoseServerSideprescription[0].dose,
   });

  }

}
