import { Component, OnInit, Inject, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { NotifierService } from "angular-notifier";
import { ServiceCodeModal } from "src/app/platform/modules/agency-portal/masters/service-codes/service-code.modal";
import { ServiceCodeService } from "src/app/platform/modules/agency-portal/masters/service-codes/service-code.service";

@Component({
  selector: "app-add-service-code-modal",
  templateUrl: "./add-service-code-modal.component.html",
  styleUrls: ["./add-service-code-modal.component.css"]
})
export class AddServiceCodeModalComponent implements OnInit {
  serviceCodeModel: ServiceCodeModal;
  serviceCodeForm: FormGroup;
  masterServiceCode: any = [];
  submitted: boolean = false;
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private serviceCodeDialogModalRef: MatDialogRef<
      AddServiceCodeModalComponent
    >,
    private serviceCodeService: ServiceCodeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.serviceCodeModel = data;
    this.refreshGrid.subscribe(data.refreshGrid);
  }

  ngOnInit() {
    this.serviceCodeForm = this.formBuilder.group({
      id: [this.serviceCodeModel.id],
      serviceCode: [this.serviceCodeModel.serviceCode]
    });
    this.getMasterData();
  }
  getMasterData() {
    this.serviceCodeService
      .getMasterData({ masterdata: "MASTERSERVICECODE" })
      .subscribe((response: any) => {
        if (response != null) {
          this.masterServiceCode =
            response.masterServiceCode != null
              ? response.masterServiceCode
              : [];
        }
      });
  }
  get formControls() {
    return this.serviceCodeForm.controls;
  }
  onSubmit() {
    if (!this.serviceCodeForm.invalid) {
      this.submitted = true;
      this.serviceCodeModel = this.serviceCodeForm.value;
      this.serviceCodeService
        .create(this.serviceCodeModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            this.closeDialog("save");
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  onAddServiceCode() {
    this.refreshGrid.next(this.serviceCodeModel);
    this.closeDialog("close");
  }
  closeDialog(action: string): void {
    this.serviceCodeDialogModalRef.close(action);
  }
  onServiceCodeSelection(event: any) {
    this.serviceCodeModel = new ServiceCodeModal();
    this.serviceCodeModel.serviceCode = event.value.serviceCode;
    this.serviceCodeModel.serviceCodeId = event.value.id;
    this.serviceCodeModel.description = event.value.description;
    this.serviceCodeModel.modifierModel =
      event.value.masterServiceCodeModifiers;
  }
}
