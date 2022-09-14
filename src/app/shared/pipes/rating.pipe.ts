import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "rating"
})
export class RatingPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // var html='<star-rating value="'+value+'"  totalstars="5" checkedcolor="red" uncheckedcolor="black" size="24px" readonly="true"></star-rating>';
    return value;
  }
}
