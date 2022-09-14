import {
  OnInit,
  ViewEncapsulation,
  Component,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import {
  HttpClient,
  HttpEventType,
  HttpBackend,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UploadFileComponent implements OnInit {
  public progress: number;
  public message: string;
  @Input("roomId") roomId: number;
  @Input("userId") userId: number;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  ngOnInit() {}
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let filesToUpload: File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append("file" + index, file, file.name);
    });
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
    });
    this.http
      .post(
        `${environment.api_url}/Chat/SendImage/${this.userId}/${this.roomId}`,
        formData,
        { headers: headers, reportProgress: true, observe: "events" }
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round((100 * event.loaded) / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = "Upload success.";
          this.onUploadFinished.emit(event.body);
        }
      });
  };
  //   public uploadFile = files => {
  //     
  //     if (files.length === 0) {
  //       return;
  //     }

  //     let fileToUpload = <File>files[0];
  //     const formData = new FormData();
  //     formData.append("file", fileToUpload, fileToUpload.name);
  //     // const header = {
  //     //   "Content-Type": "application/json"
  //     // };
  //     this.http
  //       .post(
  //         `${environment.api_url}/Chat/SendImage/${this.userId}/${this.roomId}`,
  //         formData,
  //         {
  //           // headers: header,
  //           reportProgress: true,
  //           observe: "events"
  //         }
  //       )
  //       .subscribe(event => {
  //         if (event.type === HttpEventType.UploadProgress)
  //           this.progress = Math.round((100 * event.loaded) / event.total);
  //         else if (event.type === HttpEventType.Response) {
  //           this.message = "Upload success.";
  //           //this.onUploadFinished.emit(event.body);
  //         }
  //       });
  //   };
}
