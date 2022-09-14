import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { HomeService } from "src/app/front/home/home.service";
import { AppService } from "src/app/app-service.service";
import { VideoRecordModel } from "../../models/videoRecordModel";

@Component({
  selector: "app-text-message-format",
  templateUrl: "./text-message-format.component.html",
  styleUrls: ["./text-message-format.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TextMessageFormatComponent implements OnInit {
  @Input("message") msg: any;
  imageExtension = [".jpg", ".JPG", ".png", ".PNG", ".jpeg", ".JPEG"];
  docExtension = [".doc", ".DOC", ".docx", ".DOCX"];
  pdfExtension = [".pdf", ".PDF"];
  excelExtension = [".xls", ".XLS", ".xlsx", ".XLSX"];
  recExtension = [".rec", ".ROC"];
  archiveId: string = "";
  videoUrl: string = "";
  //isVideoStarted: boolean = false;
  @Output() videoRecordPlayback = new EventEmitter();
  constructor(
    private homeService: HomeService //private appService: AppService
  ) {
    this.videoUrl = "";
    //this.isVideoStarted = false;
  }
  ngOnInit() {}
  playRecording(msg: any) {
    console.log(msg);
    
    this.homeService.getVideoArchiveDetail(msg.message).subscribe((res) => {
      if (res.statusCode == 200) {
        this.videoUrl = res.data.url;
        //this.isVideoStarted = true;
        this.videoRecordPlayback.emit(res.data);
      } else {
        this.videoUrl = "";
        this.videoRecordPlayback.emit(null);
        //this.isVideoStarted = false;
      }
    });
  }
}
