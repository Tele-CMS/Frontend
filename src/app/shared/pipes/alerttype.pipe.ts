import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'alerttype'
})
export class AlerttypePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(value: any, args?: any): any {
    let alert , alertType : ''
    if(value != undefined && value != '')
    {
      //console.log(value);
      let desc = value && value.split(',')
     
      alert =  desc[0];
      alertType =  desc.length > 1 ? desc[1] : ' '

      if(alert == "true")
      {
        return this.sanitizer.bypassSecurityTrustHtml(`<span <i class="fa fa-exclamation-triangle redfont" title="${alertType}" aria-hidden="true"></i></span>`)
      }
      return this.sanitizer.bypassSecurityTrustHtml(`<span></span>`);   
    }
   
   
    //return this.sanitizer.bypassSecurityTrustHtml(`<span class="bgcolor-circle" style="background-color:${color}" title="${description}"></span>`)
    // if(value == true)
    // {
      //return this.sanitizer.bypassSecurityTrustHtml(`<span <i class="fa fa-exclamation-triangle redfont" title="${description}" aria-hidden="true"></i></span>`)
    // }
  //  else return null
    
  }

}
