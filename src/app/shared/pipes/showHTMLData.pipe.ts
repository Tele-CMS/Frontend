import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'textFormat'
})
export class ShowHTMLDataPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(value: any, type?: any): any {
    // let reqHtml=value.replace()
    // let reqHtml = value && value.replace(new RegExp('\/n', 'g'), 'newln')
    // new RegExp('\/n', 'g'), 
    // return this.sanitizer.bypassSecurityTrustHtml(value)
    // let val = 'Do you self-monitor your blood glucose levels? Answer: Yes Frequency: Daily Description: 122, 145, 140<br/>Do you perform a diabetic self-foot exam? Answer: Yes Frequency: Daily Description: <br/>Do you self-monitor your blood pressure? Answer: Yes Frequency: Daily Description: <br/>Do you engage in physical activity? Answer: No Frequency:  Description: <br/>;Have you had a dilated eye exam in the last 12 months? Answer: No Exam Date: <br/>;'
    // console.log(value)
    let reqHTML =value!=undefined? value.split('{{newLine}}').join('<br/>'):'';
    return this.sanitizer.bypassSecurityTrustHtml(reqHTML)
  }
}
