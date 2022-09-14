import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'showIicon'
})
export class ShowIiconPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(value: any, args?: any): any {
    let htmlVal = ''
    let arrayIndex = 0;
    if (value != undefined && value != '' && value != '--') {
      let a = value && value.split('{{newLine}}');
      for (var i = 0; i < a.length-1; i++) {

        let desc = (a[i] || '----').length >= 40 ? a[i].substring(0, 40) + '...' : a[i];

        //htmlVal = htmlVal + `<i matTooltip="${a[i]}" matTooltipClass ="example-tooltip" class="fa fa-info-circle infoIcon ml-1"></i> ${desc}  <br/>`
        htmlVal = htmlVal + `<i title="${a[i]}" matTooltipClass ="example-tooltip" class="fa fa-info-circle infoIcon ml-1"></i> ${desc}  <br/>`
       
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(htmlVal);
  }

}
