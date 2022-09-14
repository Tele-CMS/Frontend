import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControlBase, QuestionBase } from './dynamic-form-models';



@Injectable()
export class DynamicFormControlService {
    constructor() { }

    // toFormGroup(controls: ControlBase<string>[]) {
    //     const group: any = {};
    //     if (controls && controls.length > 0) {
    //         controls.forEach(c => {
    //             group[c.formControlName] = c.isRequired ? new FormControl(c.value || undefined, Validators.required)
    //                 : new FormControl(c.value || undefined);
    //         });
    //     }
    //     return new FormGroup(group);
    // }

    toFormGroup(questions: ControlBase<string>[] ) {
        const group: any = {};
    
        questions.forEach(question => {
          group[question.formControlName] = this.getControl(question);
        });
        return new FormGroup(group);
      }

      getControl(question: ControlBase<string>){
          
          if(question.controlType === 'checkbox'){
              const formArray:FormControl[] =[];
            question.options.forEach(() => formArray.push(new FormControl(undefined)));
            return new FormArray(formArray);
          } else {
            return question.isRequired ? new FormControl(question.value || undefined, Validators.required)
            : new FormControl(question.value || undefined)
          }
         
      }
}