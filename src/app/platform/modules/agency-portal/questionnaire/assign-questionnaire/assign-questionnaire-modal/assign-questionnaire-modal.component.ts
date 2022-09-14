import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { PatientDocumentModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';
import { catchError, filter, tap, takeUntil, debounceTime, map, finalize, delay } from 'rxjs/operators';
import { format } from 'date-fns';

interface ClientModal {
id: number;
value: string;
dob: Date;
mrn: string;
}

@Component({
selector: 'app-assign-questionnaire-modal',
templateUrl: './assign-questionnaire-modal.component.html',
styleUrls: ['./assign-questionnaire-modal.component.css']
})
export class AssignQuestionnaireModalComponent implements OnInit, OnDestroy{
patientDocumentModel: PatientDocumentModel;
patientDocumentForm: FormGroup;
submitted: boolean = false;
assignedBy: string;
// master value fields
masterDocuments: any = [];
patientDocumentId:number;
selectedLocationId: number;

// autocomplete
memberFilterCtrl: FormControl = new FormControl();
public searching: boolean = false;
public filteredServerSideMembers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
fetchedFilteredServerSideMembers: Array<any>;
selectFilteredServerSideMembers: Array<any>;
protected _onDestroy = new Subject<void>();

constructor(private formBuilder: FormBuilder,
private patientDocumentDialogModalRef: MatDialogRef<AssignQuestionnaireModalComponent>,
private patientDocumentService: DocumentService,
@Inject(MAT_DIALOG_DATA) public data: any,
private notifier: NotifierService
) {
this.patientDocumentModel = data.patientDocumentModel; 
this.patientDocumentId = data.patientDocumentId,
this.masterDocuments = data.masterDocuments;
this.assignedBy = data.assignedBy;
this.selectedLocationId = data.selectedLocationId;
this.selectFilteredServerSideMembers = data.selectFilteredServerSideMembers || [];
this.fetchedFilteredServerSideMembers = [];
}

ngOnDestroy(): void {
this._onDestroy.next();
this._onDestroy.complete();
}

ngOnInit() {
this.patientDocumentForm = this.formBuilder.group({
id: [this.patientDocumentModel.id],
documentId: [this.patientDocumentModel.documentId],
patientId: [this.patientDocumentModel.patientId],
completionDate: [this.patientDocumentModel.completionDate],
expirationDate:[this.patientDocumentModel.expirationDate]
});
this.memberFilterCtrl.valueChanges
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
// return this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1);
}),
delay(500)
)
.subscribe(filteredMembers => {
this.searching = false;
filteredMembers.subscribe(res => { this.fetchedFilteredServerSideMembers = res; this.filteredServerSideMembers.next(res) });
},
error => {
// no errors in our simulated example
this.searching = false;
// handle error...
});

}

_filter(value: string): Observable<any> {
const filterValue = value.toLowerCase();
return this.patientDocumentService
.getPatientsByLocation(filterValue, this.selectedLocationId)
.pipe(
map(
(response: any) => {
if (response.statusCode !== 201)
return [];
else
return (response.data || []).map((clientObj: any) => {
const Obj: ClientModal = {
id: clientObj.patientId,
value: clientObj.firstName + ' ' + clientObj.lastName,
dob: new Date(clientObj.dob),
mrn: clientObj.mrn
}
return Obj;
});
}),
catchError(_ => {
return [];
})
);
}

get getSlectFilteredServerSideMembers() {
return (this.selectFilteredServerSideMembers || []).filter(x => {
if ((this.fetchedFilteredServerSideMembers || []).findIndex(y => y.id == x.id) > -1)
return false;
else
return true;
})
}

onPatientSelect(id) {

let clientsArray = this.fetchedFilteredServerSideMembers || [];
clientsArray = [...this.selectFilteredServerSideMembers, ...clientsArray];
clientsArray = Array.from(new Set(clientsArray.map(s => s)));
this.selectFilteredServerSideMembers = clientsArray.filter(x => x.id == id);
}

get formControls() { return this.patientDocumentForm.controls; }

onSubmit() {
if (this.patientDocumentForm.invalid) {
return false;
}
this.submitted = true;
this.patientDocumentModel = this.patientDocumentForm.value;
this.patientDocumentModel.assignedBy = this.assignedBy;
this.patientDocumentModel.assignedDate = format(new Date(), 'MM/DD/YYYY')
this.patientDocumentService.assignDocumentToPatient(this.patientDocumentModel).subscribe((response: any) => {
this.submitted = false;
if (response.statusCode === 200) {
this.notifier.notify('success', response.message);
this.closeDialog('save');
} else {
this.notifier.notify('error', response.message);
}
});
}

closeDialog(action: string): void {
this.patientDocumentDialogModalRef.close(action);
}

}