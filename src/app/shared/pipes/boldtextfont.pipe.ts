import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'boldtextfont'
})
export class BoldTextFontPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, args?: any): any {
    let htmlVal = '', reqData = ''

    if (value != undefined && value != '') {
       reqData = value && value.split('**')
      htmlVal = reqData[1] == '1' ? `<span><strong>${reqData[0]}</strong></span>` : `<span>${reqData[0]}</span>`

    }
    return this.sanitizer.bypassSecurityTrustHtml(htmlVal)
  }

}
