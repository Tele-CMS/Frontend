import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'span'
})
export class SpanPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer)
  {
  }
  transform(value: any, type?: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(`<span class="bgcolor-circle" style="background-color:${value}"></span>`)
  }
}
