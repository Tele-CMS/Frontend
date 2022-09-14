import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';

@Pipe({
  name: 'fontclrwtooltip'
})
export class FontcolorWithTooltipPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(value: any, type?: any): any {
    let htmlVal = ''
    let arrayIndex = 0;
    if (value != undefined && value != '' && value != '--') {
      let a = value && value.split(',');
      for (var i = 1; i <= a.length / 7; i++) {
        let textDec = a[arrayIndex + 2] == "true" ? 'underline' : 'none';
        if (a[arrayIndex + 3] != '' && a[arrayIndex + 3] != null && a[arrayIndex + 3] != "undefined") {
          let convertedTime = format(a[arrayIndex + 4], "hh:mm A"),
            title = `Device Type : ${a[arrayIndex + 3]}, Time : ${convertedTime} (${a[arrayIndex + 6]})` ;
          let reqTextForHTML = a[arrayIndex + 5] = true ? `<label title="${title}" style="color:${a[arrayIndex + 1]};text-decoration:${textDec}"><b>${a[arrayIndex]}</b></label>` : `<label title="${title}" style="color:${a[arrayIndex + 1]};text-decoration:${textDec}">${a[arrayIndex]}</label>`
          htmlVal = htmlVal + reqTextForHTML

        } else {
          htmlVal = htmlVal + `<label title="" style="color:${a[arrayIndex + 1]};;text-decoration:${textDec}">${a[arrayIndex]}</label>`
        }
        arrayIndex = arrayIndex + 7;
      }
      // }
    } else if (value == '--') {
      htmlVal = `<label style="color:'#00000'; text-decoration: underline;">${value}</label>`
    } else if (value == '') {
      htmlVal = `<label style="color:'#00000';">--</label>`
    }
    return this.sanitizer.bypassSecurityTrustHtml(htmlVal.replace(/(^,)|(,$)/g, ""));
  }
}
