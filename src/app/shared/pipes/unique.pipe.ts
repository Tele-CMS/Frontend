import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";
@Pipe({
  name: "unique",
  pure: false
})
export class UniquePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    var days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    var availDay = [];
    if (value !== undefined && value !== null) {
      days.forEach(day => {
        var index = value.findIndex(x => x.day == day);
        if (index == -1)
          availDay.push({
            day: day,
            class: "",
            disabled: true,
            title: "Not Available"
          });
        else
          availDay.push({
            day: day,
            class: "active",
            disabled: false,
            title: "Available"
          });
      });
    }
    return availDay;
  }
}
