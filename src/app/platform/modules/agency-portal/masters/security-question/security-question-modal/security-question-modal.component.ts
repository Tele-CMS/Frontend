import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  Validators,
  FormControl
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SecurityQuestionModel } from "../security-question.model";
import { SecurityQuestionService } from "../security-question.service";
import { NotifierService } from "angular-notifier";
import { Observable } from "rxjs";

@Component({
  selector: "app-security-question-modal",
  templateUrl: "./security-question-modal.component.html",
  styleUrls: ["./security-question-modal.component.css"]
})
export class SecurityQestionModalComponent implements OnInit {
  securityQuestionModel: SecurityQuestionModel;
  securityQuestionForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private securityQuestionDialogModalRef: MatDialogRef<
      SecurityQestionModalComponent
    >,
    private securityQuestionService: SecurityQuestionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService
  ) {
    this.securityQuestionModel = data;
  }

  ngOnInit() {
    this.securityQuestionForm = this.formBuilder.group({
      id: [this.securityQuestionModel.id],
      question: new FormControl(this.securityQuestionModel.question, {
        validators: [Validators.required],
        asyncValidators: [this.validateSecurityQuestion.bind(this)],
        updateOn: "blur"
      }),
      isActive: [this.securityQuestionModel.isActive]
    });
  }
  get formControls() {
    return this.securityQuestionForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.securityQuestionForm.invalid) {
      this.submitted = false;
      return;
    }
    this.securityQuestionModel = this.securityQuestionForm.value;
    this.securityQuestionService
      .create(this.securityQuestionModel)
      .subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode === 200) {
          this.notifier.notify("success", response.message);
          this.closeDialog("SAVE");
        } else {
          this.notifier.notify("error", response.message);
        }
      });
  }
  closeDialog(type?: string): void {
    this.securityQuestionDialogModalRef.close(type);
  }

  validateSecurityQuestion(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise(resolve => {
      const postData = {
        labelName: "Question",
        tableName: "MASTER_SECURITYQUESTION_QUESTION",
        value: ctrl.value,
        colmnName: "QUESTION",
        id: this.securityQuestionModel.id
      };
      if (!ctrl.dirty) {
        resolve();
      } else
        this.securityQuestionService
          .validate(postData)
          .subscribe((response: any) => {
            if (response.statusCode != 202) resolve({ uniqueName: true });
            else resolve();
          });
    });
  }
}
