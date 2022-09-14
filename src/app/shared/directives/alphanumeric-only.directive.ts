import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlphanumericOnly]'
})
export class AlphanumericOnlyDirective {
  @Input() alphabetsOnly?: boolean;
  @Input() allowNoSpace?: boolean;
  @Input() allowFirstName?: boolean;


  private regex: RegExp;
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    if (this.alphabetsOnly)
      this.regex = new RegExp(/^[a-zA-Z][a-zA-Z\s]*$/g);
    else if (this.allowNoSpace)
      this.regex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]*$/g);
    else if (this.allowFirstName)  
      this.regex = new RegExp(/^([a-z]+[,.]?[ ]?|[a-z]+['-]?)+$/i);
      // this.regex = new RegExp(/^[a-z ,.'-]+$/i);
    else
      this.regex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9\s,.'-]*$/g);


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
