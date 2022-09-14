import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "status"
})
export class StatusPipe implements PipeTransform {
  transform(value: any, type?: any): any {
    let updatedValue = "",
      className = "";
    if (typeof value == "boolean") {
      (updatedValue = value ? "Yes" : "No"),
        (className = value ? "greenfont" : "orangefont");
      if (Array.isArray(type) && type.length == 2) {
        updatedValue = value ? type[0] : type[1];
      }
    } else if (typeof value == "string") {
      className = "";
      const maxLen = type;
      updatedValue =
        value.length > maxLen ? value.substring(0, maxLen) + "..." : value;
    }
    return `<span class="${className}">${updatedValue}</span>`;
  }
}
