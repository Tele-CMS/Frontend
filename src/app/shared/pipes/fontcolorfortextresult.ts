import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'fontcolorfortextresult'
})
export class FontcolorWithUnderlineForTextResultPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }
    transform(value: any, type?: any): any {
        let htmlVal = ''
        let arrayIndex = 0;
        if (value != undefined && value != '' && value != '--') {
            let a = value && value.split('**');
            for (var i = 1; i <= a.length / 3; i++) {
                let textDec = a[arrayIndex + 2] == "true" ? 'underline' : 'none';
                htmlVal = htmlVal + `<label style="color:${a[arrayIndex + 1]};text-decoration:${textDec}">${a[arrayIndex]}</label>`
                arrayIndex = arrayIndex + 3;
            }
        } else if (value == '--') {
            htmlVal = `<label style="color:'#00000';">${value}</label>`
        } else if (value == '') {
            htmlVal = `<label style="color:'#00000';">--</label>`
        }
        return this.sanitizer.bypassSecurityTrustHtml(htmlVal.replace(/(^,)|(,$)/g, ""));
    }
}
