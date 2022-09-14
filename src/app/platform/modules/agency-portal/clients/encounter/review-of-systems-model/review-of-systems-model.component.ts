import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { EncounterService } from '../encounter.service';

@Component({
  selector: 'app-review-of-systems-model',
  templateUrl: './review-of-systems-model.component.html',
  styleUrls: ['./review-of-systems-model.component.css']
})
export class ReviewOfSystemsModelComponent implements OnInit {
  @Input() encounter: any;
  @Input() section: any;
  patient_empi: number;
  encounter_id: number;

  readonly: boolean = false;
  sampleMultiselectData: any = [];
  selectedLabel: string = 'None selected';
  loader: boolean = false;
  reviewSystemForm: FormGroup;
  isHistoryChanged: boolean = false;
  isHistoryCount: number = 0;
  loading: boolean = true;
  unselectedHistOption: any[] = [];
  newhistory = [];
  savedHistoryValues = [];
  sectonColorIndicatorModel: any = [];
  isSubmit: boolean = false;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    // public _dataService: DataExchangeService,
    private encounterService: EncounterService,
    private notifier: NotifierService,
    private reviewOfSystemsDialogModalRef: MatDialogRef<ReviewOfSystemsModelComponent>,
    @Inject(MAT_DIALOG_DATA) public id: any
  ) {
    console.log("the id is ",id)
    // this.sectonColorIndicatorModel = new SectonColorIndicatorModel();
    this.reviewSystemForm = this.fb.group({
      systems: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.getReviewSystem();
    this.getPatientEmpi();
  }

  getReviewSystem() {
    let emp_id = this.encounter.encounterDate.encounter.patient_empi;
    let encounter_id = this.encounter.encounterDate.encounter.id;
    var data = {
      emp_id: emp_id,
      encounter_id: encounter_id,
    };
    this.loading = true;
    this.encounterService.getReviewSystemData(data).subscribe((result: any) => {
      this.loading = false;
      this.savedHistoryValues = result.savedReviewSystemDto.history;
      if (result != null) {
        const systemscontrol = <FormArray>(
          this.reviewSystemForm.controls['systems']
        );
        var distinctSystemIds = Array.from(
          new Set(
            result.savedReviewSystemDto.system.map(function (x) {
              return x.system_id;
            })
          )
        );
        result.savedReviewSystemDto.system.forEach((item) => {
          if (item) {
            var obj = {
              saved_category_id: item.saved_category_id,
              system_id: item.system_id,
              system_name: item.system_name,
              history: result.reviewSystemDto.history.filter(
                (x) => x['system_id'] == item['system_id']
              ),
              selectedhistoptions: result.savedReviewSystemDto.history
                .filter((x) => x['system_id'] == item['system_id'])
                .sort((a, b) => a.history_id - b.history_id),
              comments: item.comments,
            };
            systemscontrol.push(this.refinedData(obj));
          }
        });

        result.reviewSystemDto.system.forEach((item) => {
          if (item) {
            var isAlreadyAdded = distinctSystemIds.filter(
              (y) => y == item.system_id
            )[0];
            if (!isAlreadyAdded) {
              var obj = {
                saved_category_id: '0',
                system_id: item.system_id,
                system_name: item.system_name,
                history: result.reviewSystemDto.history.filter(
                  (x) => x['system_id'] == item['system_id']
                ),
                selectedhistoptions: [],
                comments: '',
              };
              systemscontrol.push(this.refinedData(obj));
            }
          }
        });
      }
    });
  }

  refinedData(data: any) {
    return this.fb.group({
      saved_category_id: data.saved_category_id,
      system_id: data.system_id,
      system_name: data.system_name,
      history: new FormControl(data.history),
      selectedhistoptions: new FormControl(data.selectedhistoptions),
      comments: new FormControl(data.comments),
    });
  }

  getPatientEmpi() {
    if (this.encounter != null) {
      if (this.encounter.encounterDate.encounter.id > 0) {
        this.patient_empi = this.encounter.encounterDate.encounter.patient_empi;
        this.encounter_id = this.encounter.encounterDate.encounter.id;
      } else {
        this.patient_empi = this.encounter.encounterDate.linkappointment.patient_empi;
        this.encounter_id = this.encounter.encounterDate.linkappointment.appt_id;
      }
      this.readonly = this.encounter.readOnly;
    }
  }

  onHistoryChange(event, item) {
    var isexist = event.value.filter(
      (x) => x.history_id == event.itemValue.history_id
    )[0];
    if (event.itemValue.history_id == item.value.history[0].history_id) {
      if (isexist) {
        item.value.selectedhistoptions = [];
        item.value.selectedhistoptions.push(item.value.history[0]);
        var allunselectd = item.value.history.filter(
          (z) => z.history_id != item.value.history[0].history_id
        );
        allunselectd.map((e) => (e.active = false));
        this.unselectedHistOption = [...allunselectd];
      }
    } else {
      if (isexist) {
        const index = item.value.selectedhistoptions.indexOf(
          item.value.history[0]
        );
        if (index > -1) {
          item.value.selectedhistoptions.splice(index, 1);
        }
        var firstunselected = item.value.history[0];
        firstunselected.active = false;
        this.unselectedHistOption.push(firstunselected);
      }
    }
    var filtered = item.value.selectedhistoptions.filter(
      (x) => x.history_id == event.itemValue.history_id
    )[0];
    if (isexist) {
      if (filtered) filtered.active = true;
    } else {
      if (filtered) filtered.active = false;
    }

    if (!filtered) {
      var uncheck = event.itemValue;
      uncheck.active = false;
      this.unselectedHistOption.push(uncheck);
    } else {
      const index = this.unselectedHistOption.indexOf(event.itemValue);
      if (index > -1) {
        this.unselectedHistOption.splice(index, 1);
      }
    }
  }

  saveComments(event, item) {
    item.value.comments = event.target.value;
  }

  submit() {
    this.reviewSystemForm.value.systems.forEach((element) => {
      if (element.selectedhistoptions.length > 1) {
        var previousActiveHistoryid = element.selectedhistoptions.filter(
          (x) => x.active == true && x.ideal_choice == false
        );
      } else {
        var previousActiveHistoryid = element.selectedhistoptions.filter(
          (x) => x.active == true
        );
      }
      this.newhistory = [];
      let commonValues = this.savedHistoryValues.filter(
        (x) => x.system_id == element.system_id
      );
      this.newhistory = commonValues.filter(
        (entry1) =>
          !previousActiveHistoryid.some(
            (entry2) => entry1.history_id === entry2.history_id
          )
      );
      this.newhistory.map((e) => (e.active = false));
      element.selectedhistoptions = [
        ...previousActiveHistoryid,
        ...this.newhistory,
      ];
    });

    var saveObj = {
      patient_id: this.encounter.encounterDate.encounter.patient_empi,
      encounter_id: this.encounter.encounterDate.encounter.id,
      user_id: atob(localStorage.getItem('userid')),
      system_review: this.reviewSystemForm.value.systems,
    };
    this.loader = true;
    this.isSubmit = true;
    this.encounterService.saveSystemReview(saveObj).subscribe((result) => {
      if (result) {
        this.saveColorIndicotar();
        this.isSubmit = false;

        this.loader = false;
        this.notifier.notify('success', 'Review has be saved successfully');
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Review has be saved successfully',
        // });
        this.reviewSystemForm = this.fb.group({
          systems: new FormArray([]),
        });
        this.getReviewSystem();

        let member = {
          section: 'review-of-systems',
          assessment_name: 'Review of Systems',
          status: true,
        };
        // this._dataService.sendSectionEvent(member);
      }
    });
  }

  saveColorIndicotar() {
    // this.sectonColorIndicatorModel.encounter_id = this.encounter.encounterDate.encounter.id;
    // this.sectonColorIndicatorModel.fill_status = true;
    // this.sectonColorIndicatorModel.section_id = this.section.section_id;
    // if (this.section.datatype == 'datagrid') {
    //   this.sectonColorIndicatorModel.datagrid_id = this.section.assessment_id;
    // } else {
    //   this.sectonColorIndicatorModel.assesment_id = this.section.assessment_id;
    // }
    // this.encounterService
    //   .saveSectionColorIndicator(this.sectonColorIndicatorModel)
    //   .subscribe((res: any) => {});
  }

  getIdealChoices() {
    this.selectedLabel = '';
    this.reviewSystemForm.value.systems.forEach((element) => {
      element.selectedhistoptions = [];
      element.history.map((y) => (y.active = false));
      var getidealchoice = element.history.filter(
        (x) => x.ideal_choice == true
      );
      getidealchoice.forEach((element) => {
        element.active = true;
      });
      element.selectedhistoptions.push(element.history[0]);
    });
    this.cd.detectChanges();
  }
  closeDialog(action: string): void {
    this.reviewOfSystemsDialogModalRef.close(action);
  }
}
