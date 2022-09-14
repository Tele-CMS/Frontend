import { Pipe, PipeTransform } from "@angular/core";
import { from } from "rxjs";

@Pipe({
  name: "userChatName",
})
export class TextChatUserNamePipe implements PipeTransform {
  transform(value: any, args?: any): any {
   // 
    var name = "";
    //var userList = from(args);
    var index = args.findIndex((x) => x.userId == value);
    if (index > -1) {
      name = args[index].name; //args.find(x => x.userId == value).image;
    }
    // userList.subscribe((user: any) => {
    //   if (user.userId == value) {
    //     name = user.name;
    //     console.log(name);
    //     return name;
    //   } else return name;
    // });
    return name;
  }
}
