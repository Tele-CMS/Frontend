import { Component, OnInit, Inject } from '@angular/core';
import { ClientListingService } from '../../../client-listing/client-listing.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AlertsReminderModel } from '../client-alerts-listing/client-alerts.model';
import { ClientAlertsService } from '../client-alerts.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.css']
})
export class ReminderModalComponent implements OnInit {
  reminderForm: FormGroup;
  reminderTitle: string;
  reminderMessageType: string;
  reminderStartDate: string;
  reminderEndDate: string;
  masterReminderFrequencyType: Array<any> = [];
  reminderFrequencyType: string;
  reminderEnrollmentType: string;
  masterEnrollmentTypeFilter: Array<any> = [];
  masterMessageType: Array<any> = [];
  reminderModel:AlertsReminderModel;
  submitted: boolean = false;
  filterModel:any;

  constructor(
    private formBuilder: FormBuilder,
    private dialogModalRef: MatDialogRef<ReminderModalComponent>,
    private clientListingService: ClientListingService,
    public clientAlertsService: ClientAlertsService,
    public activityModalPopup: MatDialogRef<ReminderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReminderModalComponent,
    private notifier: NotifierService
  ) { 
    this.filterModel = data;
  }

  ngOnInit() {
    this.getFieldDescription();
    this.getMasterData();
    this.initializeFormFields(this.reminderModel);
  }

  onNoClick(): void {
    this.dialogModalRef.close();
  }

  initializeFormFields(ReminderObj?: AlertsReminderModel){
    ReminderObj = ReminderObj || new AlertsReminderModel();
    ReminderObj.masterReminderMessageTypeIDs = (ReminderObj.messageTypeIds || []).map(x => x.messageTypeID)
    const configControls = {
      'title': [ReminderObj.title],
      'startDate': [ReminderObj.startDate],
      'endDate': [ReminderObj.endDate],
      'masterReminderMessageTypeIDs': [ReminderObj.masterReminderMessageTypeIDs],
      'masterReminderFrequencyTypeId': [ReminderObj.masterReminderFrequencyTypeID],
      'isActive': [ReminderObj.isActive],
      //'enrollmentId': [ReminderObj.enrollmentId],
      'isSendReminderToCareManager': [ReminderObj.isSendReminderToCareManager],
      'careManagerMessage': [ReminderObj.careManagerMessage],
      'message': [ReminderObj.message],
      'notes':[ReminderObj.notes]
    };
    this.reminderForm = this.formBuilder.group(configControls);
  } 

  getFieldDescription() {
    this.reminderTitle = "Reminder Title";
    this.reminderMessageType = "Message Type";
    this.reminderStartDate = "Start Date";
    this.reminderEndDate = "End Date";
    this.reminderFrequencyType = "Frequency Type";
    this.reminderEnrollmentType = "Enrollment Type";
  }

  get f() { return this.reminderForm.controls; }

  onSubmit():any {
    this.submitted = true;
    if (this.reminderForm.invalid) {
      this.submitted = false;
      return;
    }
       this.reminderModel = this.reminderForm.value;
       this.reminderModel.id = 0;// this.reminderId;
      //Fill in filterModel
      this.reminderModel.locationIds = this.filterModel.locationId;
      this.reminderModel.AlertTypeIds = this.filterModel.alertTypeIds;
      this.reminderModel.CareManagerIds = this.filterModel.careManagerIds;
      this.reminderModel.ComorbidConditionIds = this.filterModel.comorbidConditionIds;
      this.reminderModel.FilterEndDate = this.filterModel.filterEndDate;
      this.reminderModel.EnrollmentId = this.filterModel.enrollmentId;
      this.reminderModel.GenderIds = this.filterModel.genderIds;
      this.reminderModel.PrimaryConditionId = this.filterModel.primaryConditionId;
      this.reminderModel.ProgramIds = this.filterModel.programIds;
      this.reminderModel.RelationshipIds = this.filterModel.relationshipIds;
      this.reminderModel.FilterStartDate = this.filterModel.filterStartDate;
      this.reminderModel.dob = this.filterModel.dob;
      this.reminderModel.eligibilityStatus = this.filterModel.eligibilityStatus;
      this.reminderModel.endAge = this.filterModel.endAge;
      this.reminderModel.medicalID = this.filterModel.medicalID;
      this.reminderModel.riskIds = this.filterModel.riskIds;
      this.reminderModel.searchText = this.filterModel.searchText;
      this.reminderModel.startAge = this.filterModel.startAge;

    const reminderObj = {
      ...this.reminderModel,
      masterReminderMessageTypeIDs: (this.reminderModel.masterReminderMessageTypeIDs || []).join(',')
    }
    this.clientAlertsService.createReminder(reminderObj).subscribe((response) => {
      this.submitted = false; 
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.activityModalPopup.close('SAVE');
      }
      else {
        this.notifier.notify('error', response.message)
      }
    });
  }

  getMasterData(){
    let data = 'MASTERENROLLMENTTYPEFILTER,MASTERMESSAGETYPE,MASTERREMINDERFREQUENCYTYPE'
    this.clientListingService.getMasterData(data).subscribe((response: any) => {
      if(response != null) {
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        this.masterMessageType = response.masterMessageType != null ? response.masterMessageType : [];
        this.masterReminderFrequencyType = response.masterReminderFrequencyType != null ? response.masterReminderFrequencyType:[];
      }
    });
  }

  onClickCheckbox(event: any, keytext: string){
    // if(event.checked){
    //   this.isCareManager = true;
    //   this.reminderForm.get('isSendReminderToCareManager').setValidators(Validators.required)
    //   this.reminderForm.get('isSendReminderToCareManager').updateValueAndValidity();
    // }
    // else{
    //   this.isCareManager = false;
    //   this.reminderForm.get('isSendReminderToCareManager').clearValidators();
    //   this.reminderForm.get('isSendReminderToCareManager').updateValueAndValidity();
    //   this.reminderForm.get('careManagerMessage').clearValidators();
    //   this.reminderForm.get('careManagerMessage').updateValueAndValidity();
    //   this.reminderForm.get('careManagerMessage').reset();
    // }
  }

  onStartDateSelected(event: any): void {
    // this.validateStartDate();

    // if (this.selectedLocationId) {
    // }
    // if (this.selectedLocationId && this.formControls.PatientID.value) {
    //   this.fetchDataForScheduler();
    // }
  }


  validateStartDate() {
    // const startDate = this.reminderForm.get('startDate').value

    // if(isTentative && isBefore(startDate, addDays(new Date(), 30))) {
    //   this.appointmentForm.get('startDate').setErrors({ NotGreater30: true });
    // } else {
    //   this.appointmentForm.get('startDate').setErrors(null);
    // }
  }

}
