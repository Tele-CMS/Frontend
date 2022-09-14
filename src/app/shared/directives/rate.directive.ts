import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appRate]',
})
export class RateDirective {
  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let newVal='';
    if(event!=null)
      newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } 
    else{
      newVal = newVal.replace(/^\d{0,6}(\.\d{1,2})?$/, '$1');      
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}



// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[appRate]'
// })
// export class RateDirective {

//   constructor() { }

// }
