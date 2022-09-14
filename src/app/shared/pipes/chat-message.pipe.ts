import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "chatMessage",
})
export class ChatMessagePipe implements PipeTransform {
  imageExtension = [".jpg", ".JPG", ".png", ".PNG", ".jpeg", ".JPEG"];
  transform(value: any, args?: any): any {
    if (args.messageType == 0) return value;
    else {
      var imgIndex = this.imageExtension.indexOf(args.fileType);
      if (imgIndex > -1) return '<img src="' + value + '" class="msg-img"/>';
      else return "";
    }
  }
}
