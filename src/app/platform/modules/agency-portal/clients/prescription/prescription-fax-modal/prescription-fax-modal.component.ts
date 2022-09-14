import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
//import { MedicationModel } from '../medication.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClientsService } from '../../clients.service';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, finalize, delay, catchError } from 'rxjs/operators';
import { format } from "date-fns";
import { MedicationModel } from '../../medication/medication.model';
import { PrescriptionModel, PrescriptionFaxModel } from '../prescription.model';

class PharmacyModelData {
  "id"?: number;
  "pharmacyName"?: string;
  "value"?: string;
  "pharmacyAddress"?: string;
  "pharmacyFaxNumber"?: string;
}

@Component({
  selector: 'app-prescriptionfax-modal',
  templateUrl: './prescription-fax-modal.component.html',
  styleUrls: ['./prescription-fax-modal.component.css']
})
export class PrescriptionFaxModalComponent implements OnInit {
  prescriptionFaxModel: PrescriptionFaxModel;
  prescriptionFaxForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Fax Prescription';
  masterFrequencyType: any[];
  masterPrescriptionType: any[];
  patientId: number;
  createdBy:number;
  createdDate:string;
  maxDate = new Date();
  masterCountry: any = [];
  masterState: any = [];
  masterCity: any = [];
  masterPharmacy: any = [];
  masterPharmacynames: any = [];

  // autocomplete
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideprescription: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideprescription: Array<any>;
  selectFilteredServerSideprescription: any = [];
  protected _onDestroy = new Subject<void>();

  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  //construtor
  constructor(private formBuilder: FormBuilder, private medicationDialogModalRef: MatDialogRef<PrescriptionFaxModalComponent>,
    private clientService: ClientsService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.prescriptionFaxModel = data.allergy;
    this.refreshGrid.subscribe(data.refreshGrid);
    this.patientId = this.prescriptionFaxModel.patientId;

    //header text updation
    if (this.prescriptionFaxModel.id != null && this.prescriptionFaxModel.id > 0)
      this.headerText = 'Fax Prescription';
    else
      this.headerText = 'Fax Prescription';
    this.patientId = this.prescriptionFaxModel.patientId;
      }

  // on initial load
  ngOnInit() {
    this.prescriptionFaxForm = this.formBuilder.group({
      id: [this.prescriptionFaxModel.id],
      sourceFaxNumber: [this.prescriptionFaxModel.sourceFaxNumber],
      countryID: [this.prescriptionFaxModel.countryID],
      stateID: [this.prescriptionFaxModel.stateID],
      cityID: [this.prescriptionFaxModel.cityID],
      pharmacyID: [this.prescriptionFaxModel.pharmacyID],
      pharmacyAddress: [this.prescriptionFaxModel.pharmacyAddress],
      pharmacyFaxNumber: [this.prescriptionFaxModel.pharmacyFaxNumber]
      
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
      .getMasterPharmacyByFilter(filterValue)
      .pipe(
        map(
          (response: any) => {
            if (response.statusCode != 200)
              return [];
            else
              return (response.data || []).map((dObj: any) => {
                
                const Obj: PharmacyModelData = {
                  id: dObj.id,
                  value: `${(dObj.pharmacyName || '')}`,
                  pharmacyAddress: dObj.pharmacyAddress,
                 pharmacyFaxNumber: dObj.pharmacyFaxNumber,
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
    let data = "masterCountry,masterState,masterCity,masterPharmacy";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      
      if (response != null) {
        
        this.masterCountry = response.masterCountry != null ? response.masterCountry : [];
        this.masterState = response.masterState != null ? response.masterState : [];
        this.masterCity=response.masterCity!= null? response.masterCity:[];
        this.masterPharmacy=response.masterPharmacy!= null? response.masterPharmacy:[];
      }
    });
  }

  // get all the controls
  get formControls() { return this.prescriptionFaxForm.controls; }

//   //submit the form
  onSubmit(event: any) {
    
    if (!this.prescriptionFaxForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.prescriptionFaxModel = this.prescriptionFaxForm.value;
      this.prescriptionFaxModel.patientId = this.patientId;
      this.prescriptionFaxModel.createdBy = this.createdBy;
      this.clientService.sendFax(this.prescriptionFaxModel).subscribe((response: any) => {
          
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "Send Fax")
            this.closeDialog('SAVE');
        //   else if (clickType == "SaveAddMore") {
        //     this.refreshGrid.next();
        //     this.prescriptionFaxForm.reset();
        //     //this.medicationDialogModalRef.close('SAVE');
        //   }
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

onprharmacySelect(id) {
  
  let diagnosisArray = this.fetchedFilteredServerSideprescription || [];
  diagnosisArray = [...this.selectFilteredServerSideprescription, ...diagnosisArray];
  diagnosisArray = Array.from(new Set(diagnosisArray.map(s => s)));
  this.selectFilteredServerSideprescription = diagnosisArray.filter(x => x.id == id);

  this.prescriptionFaxForm.patchValue({
    pharmacyAddress: this.selectFilteredServerSideprescription[0].pharmacyAddress,
    pharmacyFaxNumber: this.selectFilteredServerSideprescription[0].pharmacyFaxNumber,
 });
}

}
