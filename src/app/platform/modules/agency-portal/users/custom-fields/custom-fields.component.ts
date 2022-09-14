import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UsersService } from '../users.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { StaffCustomLabel } from '../staff-custom-label.model';
import { element } from 'protractor';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  staffId: number;
  staffCustomLabels: StaffCustomLabel[] = [];
  constructor(private userService: UsersService, private notifier: NotifierService) { }

  ngOnInit() {
    this.getStaffCustomLabels();
  }
  getStaffCustomLabels() {
    this.userService.getStaffCustomLabels(this.staffId).subscribe((response: ResponseModel) => {
      if (response != null) {
        this.staffCustomLabels = response.data.StaffCustomLabels;
      }
    });
  }
  onSubmit(event: any) {
    let clickType = event.currentTarget.name;
    this.userService.saveCustomLabels(this.staffCustomLabels).subscribe((response: ResponseModel) => {
      if (response != null) {
        if (response.statusCode === 200) {
          this.notifier.notify('success', response.message)
          if (clickType == "SaveContinue") {
            this.handleTabChange.next({ tab: "Availability", id: this.staffId });
          }
          else if (clickType == "Save") {
            this.getStaffCustomLabels()
          }
        } else {
          this.notifier.notify('error', response.message)
        }

      }
    });
  }
}
