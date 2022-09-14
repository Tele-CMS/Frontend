import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'blackfontclr'
})
export class BlackFontcolorPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer)
  {
  }
  transform(value: any, type?: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(`<span style="color:#000000;">${value}</span>`)
  }
}
