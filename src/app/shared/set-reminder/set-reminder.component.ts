import { Component, OnInit ,Inject} from '@angular/core';
import { SetReminderService } from './set-reminder.service'
import { CancelationRule, SetReminderModal } from './set-reminder.modal'
import { CommonService } from "./../../platform/modules/core/services/common.service";
import { Observable } from "rxjs";
import { debug } from "util";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";

@Component({
  selector: 'app-set-reminder',
  templateUrl: './set-reminder.component.html',
  styleUrls: ['./set-reminder.component.css']
})
export class SetReminderComponent implements OnInit {
  headerText: string = "";
  minDate:any=new Date();
  hoursList:number[];
  sendUserInvitationForm: FormGroup;
  submitted: boolean = false;
  private setReminderModal: SetReminderModal;
  masterRoles: any;
  userList: Array<any> = [];
  userExisted: boolean = false;
  public userType: any;
  userTypes = [{ value: 1, key: "Internal" }, { value: 2, key: "External" }];
  constructor(private setReminderService: SetReminderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<SetReminderModal>,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService) {
      this.hoursList = [2,4,16,24,48];
      this.setReminderModal = new SetReminderModal();
      this.userType = this.userTypes.find(x => x.value == 1);
      if (
        data &&
        data.appointmentId &&
        +data.appointmentId > 0 &&
        data.sessionId &&
        +data.sessionId > 0
      ) {
        this.setReminderModal.appointmentId = data.appointmentId;
        this.setReminderModal.sessionId = data.sessionId;
      } else {
        if (
          localStorage.getItem("otSession") &&
          localStorage.getItem("otSession") != ""
        ) {
          var response = JSON.parse(
            this.commonService.encryptValue(
              localStorage.getItem("otSession"),
              false
            )
          );
          this.setReminderModal.appointmentId = +response.appointmentId;
          this.setReminderModal.sessionId = +response.id;
        }
      }
      const webUrl = window.location.origin;
      this.setReminderModal.webRootUrl = `${webUrl}`;
    }
  
    ngOnInit() {
      this.sendUserInvitationForm = this.formBuilder.group(
        {
          staffId: [this.setReminderModal.staffId],
          sessionId: [this.setReminderModal.sessionId],
          appointmentId: [this.setReminderModal.appointmentId],
          webRootUrl: [this.setReminderModal.webRootUrl],
          cancelationRules: this.formBuilder.array([]),
         
        },
        { validator: this.validateForm.bind(this) }
      );
  
 this.addCancelationRuleControl(null);
    }
    addCancelationRuleControl(rule: CancelationRule) {
      this.cancelationRulesFormGroup.push(this.getCancelationRulesForm(rule));
  }
  removeCancelationRuleControl(i) {
      this.cancelationRulesFormGroup.removeAt(i);
  }

  get cancelationRulesFormGroup() {
    return  <FormArray> this.sendUserInvitationForm.controls['cancelationRules'] ;
  }

  private getCancelationRulesForm(rule:CancelationRule){
      return this.formBuilder.group({
          hour: [],
          reminderDateTime: []
      })
  }
    get formControls() {
      return this.sendUserInvitationForm.controls;
    }
    validateForm(formGroup: FormGroup) {
      return null;
    }
   
    onSubmit() {
      this.closeDialog("save");
    }
    addMoreHourOption()
    {}
    
   
    closeDialog(action: string): void {
      this.dialogModalRef.close(action);
    }
  
    
  }
  