import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { ReplaySubject, Subject} from 'rxjs';
import { EncounterService } from '../encounter.service';

@Component({
  selector: 'app-encounter-pdf-print-dialog',
  templateUrl: './encounter-pdf-print-dialog.component.html',
  styleUrls: ['./encounter-pdf-print-dialog.component.css']
})
export class EncounterPrintPDFModalComponent implements OnInit {
  masterEncounterChecklistModel: Array<any>;
  masterEncounterChecklistAdministativeModel: Array<any>;
  encounterData = [];
  patientEncounterChecklistModel: Array<any>;
  encounterChangeHistory: Array<any>;
  medicationForm: FormGroup;
  submitted: boolean = false;
  headerText: string = 'Add Medication';
  masterFrequencyType: any[];
  patientId: number;
  maxDate = new Date();
  linkedEncounterId: number;
  encounterId: number
  masterEncChecklistReviewItems: Array<any>;
  checkListIds: string[]
  key: string
  isRoleClient:boolean;
  filterCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideDiagnosis: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  fetchedFilteredServerSideDiagnosis: Array<any>;
  selectFilteredServerSideDiagnosis: Array<any>;
  PrintPatientCurrentMedicationModel: Array<any>;
  protected _onDestroy = new Subject<void>();
  constructor(private formBuilder: FormBuilder, private medicationDialogModalRef: MatDialogRef<EncounterPrintPDFModalComponent>,
    private encounterService: EncounterService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.encounterId = data.encounterId;
    this.key = data.key;
    this.isRoleClient =data.isRoleClient;
    this.checkListIds = []
    this.patientEncounterChecklistModel = [];
    this.masterEncounterChecklistModel = [];
    this.masterEncounterChecklistAdministativeModel = [];
    this.masterEncChecklistReviewItems = [];
    this.encounterChangeHistory = [];
    this.PrintPatientCurrentMedicationModel = [];
  }
  // on initial load
  ngOnInit() {
    this.getEncounterDetailsForPDF();
  }

  //submit the form
  printEncounterSummary(event: any) {
    this.encounterService.generateEncounterSummaryPDF(this.encounterId, this.checkListIds,'caremanager').subscribe((response: any) => {
      this.encounterService.downLoadFile(response, 'application/pdf', `Encounter_Summary.pdf`)
    });
  }
  getEncounterDetailsForPDF() {
    this.encounterService.getEncounterSummaryPDF(this.encounterId).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.encounterData = response.data.patientEncounterChecklistModel;
        this.masterEncounterChecklistModel = response.data.patientEncounterChecklistModel.filter(x => x.patientEncounterId > 0 && !x.isAdministrativeType);
        this.masterEncounterChecklistAdministativeModel = response.data.patientEncounterChecklistModel.filter(x => x.isAdministrativeType == true && x.patientEncounterId > 0);
        this.masterEncChecklistReviewItems = response.data.encounterChecklistReviewItems;
        this.encounterChangeHistory = response.data.encounterChangeHistory
        this.checkListIds = this.encounterData.filter(x => x.patientEncounterId > 0).map(z => { return z.id })
        this.PrintPatientCurrentMedicationModel = response.data.PrintPatientCurrentMedicationModel
      } else {
        this.encounterData = []
        this.masterEncounterChecklistModel = [];
        this.masterEncounterChecklistAdministativeModel = [];
        this.masterEncChecklistReviewItems = [];
        this.encounterChangeHistory = [];
        this.PrintPatientCurrentMedicationModel = [];
      }
    });
  }
  emailEncounterSummary() {
    this.encounterService.emailEncounterSummaryPDF(this.encounterId, this.checkListIds).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
      } else if (response.statusCode == 406) {
        this.notifier.notify('warning', response.message)
      } else {
        this.notifier.notify('error', response.message)
      }
    });
  }
  onChecklistSelection(event: any, item: any) {
    let tempChecklist = this.masterEncounterChecklistModel || [];
    if (event.checked) {
      if (this.checkListIds.filter(z => !item.id)) {
        this.checkListIds.push(item.id)
      }
    } else {
      let index = tempChecklist.findIndex(x => x.masterEncounterChecklistId == item.masterEncounterChecklistId);
      this.checkListIds.splice(index, 1)
    }
  }
  //to close popup
  closeDialog(action: string): void {
    this.medicationDialogModalRef.close(action);
  }
  isItemChecked(item: any) {
    return this.patientEncounterChecklistModel.findIndex(x => x.masterEncounterChecklistId == item.masterEncounterChecklistId) != -1;
  }
  getMmasterEncChecklistReviewItems(id: number) {
    return this.masterEncChecklistReviewItems.filter(x => x.masterEncounterChecklistId == id);
  }
  getEncounterChangeHistory(id: number) {
    return this.encounterChangeHistory.filter(x => x.masterEncounterChecklistId == id);
  }
}
