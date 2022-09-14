import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { TextChatModel } from "./textChatModel";
import { AppService } from "./../../app-service.service";
import { Observable } from "rxjs";
import { SchedulerService } from "./../../platform/modules/scheduling/scheduler/scheduler.service";
import { CommonService } from "./../../super-admin-portal/core/services/common.service";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TextChatService {
  textChatModel: TextChatModel;

  private getAppointmentDetailURL = "Home/GetAppointmentDetail?appointmentId=";
  private getChatRoomURL = "Home/GetChatRoomId";
  constructor(
    private schedulerService: SchedulerService,
    private appService: AppService,
    private http: HttpClient
  ) {
    this.textChatModel = new TextChatModel();
  }
  setAppointmentDetail(appointmentId: number, userRole: string = "") {
    this.getAppointmentDetail(appointmentId).subscribe(response => {
      var appointmentDetail = response.data;
      if (response.statusCode == 200) {
        var staff = appointmentDetail.appointmentStaffs[0]; 
        if (
          userRole.toUpperCase() == "CLIENT" ||
          userRole.toUpperCase() == "INVITED"
        ) { 
          
          this.textChatModel.Callee = "Dr. " + staff.staffName;
          this.textChatModel.CalleeImage = staff.photoThumbnail;
          this.textChatModel.Caller = appointmentDetail.patientName;
          this.textChatModel.CallerImage =
            appointmentDetail.patientPhotoThumbnailPath;
        } else { 
          
          this.textChatModel.Caller = "Dr. " + staff.staffName;
          this.textChatModel.CallerImage = staff.photoThumbnail;
          this.textChatModel.Callee = appointmentDetail.patientName;
          this.textChatModel.CalleeImage =
            appointmentDetail.patientPhotoThumbnailPath;
        }
      }
      this.appService.ChatUserInit(this.textChatModel);
    });
  }
  getAppointmentDetail(
    appointmentId: number,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.appService.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this
          .getAppointmentDetailURL}${appointmentId}`,
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.appService.setLoadingState(false);
          return res;
        })
      );
  }
  setRoomDetail(
    userId: number,
    appointmentId: number,
    isLoading: boolean = true
  ) {
    this.getRoomDetail(userId, appointmentId, isLoading).subscribe(response => { 
      var roomId = 0;
      if (response.statusCode == 200) { 
        roomId = response.data;
        this.appService.SetChatRoomDetail(roomId);
      }
    });
  }
  getRoomDetail(
    userId: number,
    appointmentId: number,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.appService.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this
          .getChatRoomURL}?userId=${userId}&appointmentId=${appointmentId}`,
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.appService.setLoadingState(false);
          return res;
        })
      );
  }

  // getAppointmentInfo(appointmentId: number, userRole: string) {
  //   this.schedulerService
  //     .getAppointmentDetails(appointmentId)
  //     .subscribe(response => {
  //       var appointmentDetail = response.data;
  //       if (response.statusCode == 200) {
  //         var staff = appointmentDetail.appointmentStaffs[0];
  //         if (userRole.toUpperCase() == "CLIENT") {
  //           this.textChatModel.Callee = "Dr. " + staff.staffName;
  //           this.textChatModel.CalleeImage = staff.photoThumbnail;
  //           this.textChatModel.Caller = appointmentDetail.patientName;
  //           this.textChatModel.CallerImage =
  //             appointmentDetail.patientPhotoThumbnailPath;
  //         } else {
  //           this.textChatModel.Caller = "Dr. " + staff.staffName;
  //           this.textChatModel.CallerImage = staff.photoThumbnail;
  //           this.textChatModel.Callee = appointmentDetail.patientName;
  //           this.textChatModel.CalleeImage =
  //             appointmentDetail.patientPhotoThumbnailPath;
  //         }
  //       }
  //       this.appService.ChatUserInit(this.textChatModel);
  //     });
  // }
}
