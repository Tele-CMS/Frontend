import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  @Input() allowDecimals?: boolean;

  private regex: RegExp;
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (this.allowDecimals)
      this.regex = new RegExp(/^\d+\.?\d*$/g);
    else
      this.regex = new RegExp(/^[0-9]*$/g);


    // Allow Backspace, tab, end, and home keys OR allow ctrl+A
    if (this.specialKeys.indexOf(event.key) !== -1 || (event.keyCode === 65 && (event.ctrlKey || event.metaKey))) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
