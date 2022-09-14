import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ControlBase, ControlTypesHelper, QuestionBase } from '../dynamic-form-models';


@Component({
  selector: 'app-dynamic-form-control',
  templateUrl: './dynamic-form-control-component.html',
  styleUrls: ['./dynamic-form-control.component.scss']
})
export class DynamicFormControlComponent implements OnInit {
  @Input() control!: ControlBase<string>;
  @Input() form!: FormGroup;
  @Input() isSubmitted: boolean;

  constructor(private _ngZone: NgZone) {

  }


  ngOnInit(): void {
    
    if(this.control && this.control.value){
        if(this.control.controlType == ControlTypesHelper.controlTypes.checkbox){
          const valuesArray = this.control.value.split(',');
          const formArray = <FormArray>this.form.controls[this.control.formControlName];
          formArray.controls.forEach((c,i) => {
              const optionValue = this.control.options[i].key;
              if(valuesArray.includes(optionValue)){
                c.setValue(true);
              }
          })
        } else {
          if(this.control.controlType == ControlTypesHelper.controlTypes.textbox){
            
            console.log(this.control)
          }
          this.form.controls[this.control.formControlName].setValue(this.control.value);
        }
    }
  }

  get isValid() { return this.form.controls[this.control.formControlName].valid; }

  @ViewChild('autosizetestarea') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => {
        if (this.autosize)
          this.autosize.resizeToFitContent(true)
      });
  }

  hasError = (errorName: string) => {
    if (!this.isSubmitted) {
      return false;
    } else {
      if (errorName == 'required' && this.control.controlType == ControlTypesHelper.controlTypes.checkbox && this.control.isRequired) {
        const formArray = <FormArray>this.form.controls[this.control.formControlName];
        const isAnySelected = formArray.controls.some(x => x.value);
        return !isAnySelected;
      }
      else {
        return this.form.controls[this.control.formControlName].hasError(errorName);
      }
    }
  }

  get hasErrors(): boolean {
    if (!this.isSubmitted) {
      return false;
    } else {
      if (this.control.controlType == ControlTypesHelper.controlTypes.checkbox && this.control.isRequired) {
        const formArray = <FormArray>this.form.controls[this.control.formControlName];
        const isAnySelected = formArray.controls.some(x => x.value);
        return !isAnySelected;
      }
      else {
        return (this.form.controls[this.control.formControlName].valid) ? false : true;
      }
    }
  }
}