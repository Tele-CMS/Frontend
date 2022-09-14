import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'fontclr'
})
export class FontcolorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(value: any, type?: any): any {
    let htmlVal = ''
    let arrayIndex = 0;
    if (value != undefined && value != '' && value != '--') {
      let a = value && value.split(',');
      for (var i = 1; i <= a.length / 2; i++) {
        htmlVal = htmlVal + `<label style="color:${a[arrayIndex + 1]};">${a[arrayIndex]}</label>`
        arrayIndex = arrayIndex + 2;
      }
    } else if (value == '--') {
      htmlVal = `<label style="color:'#00000'; text-decoration: underline;">${value}</label>`
    } else if (value == '') {
      htmlVal = `<label style="color:'#00000';">--</label>`
    }
    return this.sanitizer.bypassSecurityTrustHtml(htmlVal.replace(/(^,)|(,$)/g, ""));
  }
}
