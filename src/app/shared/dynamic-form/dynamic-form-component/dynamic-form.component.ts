import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DynamicFormControlService } from '../dynamic-form-control-service';
import { ControlBase, ControlTypesHelper, QuestionBase, QuestionnaireAnswerModel } from '../dynamic-form-models';



@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [DynamicFormControlService]
})
export class DynamicFormComponent implements OnInit {
  @Input() isFormDisabled = false;
  @Input() controls: ControlBase<string>[] | null = [];
  @Output() onSubmitEmitter: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  payLoad = '';
  isSubmitted = false;

  constructor(private fcs: DynamicFormControlService) { }

  ngOnInit() {
    this.form = this.fcs.toFormGroup(this.controls as ControlBase<string>[]);
    if(this.isFormDisabled){
      this.form.disable();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit() {
    this.markFormGroupTouched(this.form);
    this.isSubmitted = true
    if (this.form.invalid) {
      return;
    }
    if (this.controls.some(x => x.controlType == ControlTypesHelper.controlTypes.checkbox)) {
      let isInvalid = false;
      const checkboxControls = [...this.controls.filter(x => x.controlType == ControlTypesHelper.controlTypes.checkbox)];
      checkboxControls.forEach(cb => {
        const formArray = <FormArray>this.form.controls[cb.formControlName];
        const isAnySelected = formArray.controls.some(x => x.value);
        if (!isInvalid) {
          isInvalid = !isAnySelected;
        }
      });
      if (isInvalid) {
        return;
      } else {
        this.createPayload(this.form.value)
      }

    } else {
      this.createPayload(this.form.value)
    }

  }

  private createPayload(formData) {

    let answers: QuestionnaireAnswerModel[] = [];

    this.controls.forEach(c => {

      if (c.controlType == ControlTypesHelper.controlTypes.checkbox) {
        const cbOptionsArray = formData[c.formControlName];
        const cbValues: string[] = [];
        cbOptionsArray.forEach((cbValue, index) => {
          if (cbValue) {
            const valTxt = c.options[index].key;
            cbValues.push(valTxt);
          }
        });
        const ans: QuestionnaireAnswerModel = { answer: cbValues.toString(), questionId: c.questionId };
        answers.push(ans);
      }
      else {
        const ans: QuestionnaireAnswerModel = { answer: formData[c.formControlName], questionId: c.questionId };
        answers.push(ans);
      }
    });

    this.onSubmitEmitter.emit(answers);
  }
}