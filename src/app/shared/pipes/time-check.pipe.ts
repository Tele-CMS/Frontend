import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeCheck"
})
export class TimeCheckPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    var currentDate = new Date();
    const y = new Date(currentDate).getFullYear(),
      m = new Date(currentDate).getMonth(),
      d = new Date(currentDate).getDate(),
      splitTime = new Date(currentDate).getTime(),
      hours = new Date(currentDate).getHours(),
      minutes = new Date(currentDate).getMinutes();
    var totalMinutes = +hours * 60 + +minutes;
    var row = value;
    var endTime = row.endDateTime.split("T");
    var endTimeArr = endTime[1].split(":");
    var endHour = endTimeArr[0];
    var endMin = endTimeArr[1];
    var totalEndMinutes = +endHour * 60 + +endMin;
    var icons = "";
    if (totalEndMinutes > totalMinutes)
      icons = `<i class="` + args + `" aria-hidden="true"></i>`;
    console.log(
      "Total Min : " + totalMinutes + ", Total End Min : " + totalEndMinutes
    );
    console.log(
      "Current Date Time  : " +
        currentDate +
        ", End Date Time : " +
        row.endDateTime
    );
    return icons;
  }
}
