import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "encounter"
})
export class EncounterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let row = value;
    if (
      row != null &&
      row.patientEncounterId != null &&
      row.patientEncounterId != undefined &&
      row.patientEncounterId > 0
    )
      return `<i class="` + args + `" aria-hidden="true"></i>`;
    else return "";
  }
}
