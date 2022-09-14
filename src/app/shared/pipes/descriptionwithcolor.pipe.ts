import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'descriptionwithcolor'
})
export class DescriptionwithcolorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, args?: any): any {
    let description ='', color : ''

    if(value != undefined && value != '')
    {
      let desc = value && value.split('-')
     
      color =  desc[0];
      description =  desc.length > 1 ? desc[1] : ' '
   
    }
    return this.sanitizer.bypassSecurityTrustHtml(`<span class="bgcolor-circle" style="background-color:${color}" title="${description}"></span>`)
  }

}
