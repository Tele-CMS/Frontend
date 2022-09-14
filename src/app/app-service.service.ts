import { CommonService } from "src/app/platform/modules/core/services";
import { TextChatModel } from "src/app/shared/text-chat/textChatModel";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { distinctUntilChanged, map } from "rxjs/operators";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { VideoRecordModel } from "./shared/models/videoRecordModel";
import { CallInitModel, UrgentCareProviderActionInitModel } from "./shared/models/callModel";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private getChatHistoryUrl = "Home/GetChatHistory";
  private getUserInChatRoomUrl = "Home/GetUserInChatRoom";
  private startVideoRecordingUrl =
    "api/Telehealth/StartVideoRecording?sessionId=";
  private stopVideoRecordingUrl =
    "api/Telehealth/StopVideoRecording?archiveId=";
  private getCallInitiateUrl = "Home/CallInitiate";
  private getUrgentCareProviderActionInitiateUrl = "Home/UrgentCareProviderActionInitiate";
  private getcallPatientInformProviderAvailabilityUrl = "Home/PatientInformProviderAvailability";
  private getEndCallUrl = "Home/CallEnd";

  constructor(private http: HttpClient) {
    SystemIpAddress.then((value) => {
      this.SytemInfoSubject.next({ ipAddress: value });
    }).catch((e) => console.error(e));
  }
  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  public loadingState = this.loadingStateSubject.asObservable();

  private chatSubject = new BehaviorSubject<ChatInitModel>({} as ChatInitModel);
  public chat = this.chatSubject.asObservable().pipe(distinctUntilChanged());
  public CheckChatActivated(chatInitModel: ChatInitModel) {
    this.chatSubject.next(chatInitModel);
  }

  private chatUserSubject = new BehaviorSubject<TextChatModel>(
    {} as TextChatModel
  );
  public chatUser = this.chatUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  public ChatUserInit(textChatModel: TextChatModel) {
    this.chatUserSubject.next(textChatModel);
  }

  public newSelectedScreenSizeSubject = new BehaviorSubject<any>(null);
  public newSelectedScreenSize = this.newSelectedScreenSizeSubject
    .asObservable().pipe(distinctUntilChanged());

    public newSelectedVideoPositionSubject = new BehaviorSubject<any>(null);
    public newSelectedVideoPosition = this.newSelectedVideoPositionSubject
      .asObservable().pipe(distinctUntilChanged());
   

  private chatRoomSubject = new BehaviorSubject<number>(0);
  public chatRoom = this.chatRoomSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  public SetChatRoomDetail(roomId: number) {
    this.chatRoomSubject.next(roomId);
  }
  getChatHistory(
    roomId: number,
    fromUserId: number,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getChatHistoryUrl}?FromUserId=${fromUserId}&RoomId=${roomId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }
  getUserInChatRoom(
    roomId: number,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getUserInChatRoomUrl}?roomId=${roomId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }
  get getAdditionalHeaders(): string {
    const additionalHeaders = JSON.stringify({
      Offset: new Date().getTimezoneOffset().toString(),
      Timezone: this.calculateTimeZone(),
      IPAddress: this.getSystemIpAddress(),
    });
    return additionalHeaders;
  }
  calculateTimeZone(dateInput?: Date): string {
    var dateObject = dateInput || new Date(),
      dateString = dateObject + "",
      tzAbbr: any =
        // Works for the majority of modern browsers
        dateString.match(/\(([^\)]+)\)$/) ||
        // IE outputs date strings in a different format:
        dateString.match(/([A-Z]+) [\d]{4}$/);

    if (tzAbbr) {
      // Old Firefox uses the long timezone name (e.g., "Central
      // Daylight Time" instead of "CDT")
      tzAbbr = tzAbbr[1];
    }
    return tzAbbr;
  }
  private SytemInfoSubject = new BehaviorSubject<any>({});
  public sytemInfo = this.SytemInfoSubject.asObservable().pipe(
    distinctUntilChanged()
  );
  getSystemIpAddress(): string {
    return this.SytemInfoSubject.value && this.SytemInfoSubject.value.ipAddress;
  }

  setLoadingState(isLoading: boolean = false) {
    this.loadingStateSubject.next(isLoading);
  }

  private videoSubject = new BehaviorSubject<boolean>({} as false);
  public video = this.chatSubject.asObservable().pipe(distinctUntilChanged());
  public setVideoStarted(isVideoStarted: boolean) {
    this.videoSubject.next(isVideoStarted);
  }

  startVideoRecording(
    sessionId: string,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      //businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    //isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.startVideoRecordingUrl}${sessionId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          //isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }
  private videoRecordingStartedSubject = new BehaviorSubject<VideoRecordModel>(
    {} as VideoRecordModel
  );
  public videoRecordingStarted = this.videoRecordingStartedSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  public CheckVideoRecordStatus(videoRecordModel: VideoRecordModel) {
    this.videoRecordingStartedSubject.next(videoRecordModel);
  }
  stopVideoRecording(
    archiveId: string,
    appointmentId: number,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      //businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    //isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.stopVideoRecordingUrl}${archiveId}&appointmentId=${appointmentId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          //isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }

  getCallInitiate(
    appointmentId: number,
    userId: number,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getCallInitiateUrl}?appointmentId=${appointmentId}&userId=${userId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }

  getEndCall(
    appointmentId: number,
    userId: number,
    isLoading: boolean = true
  ): Observable<any> {
    console.log("7 getcallinitiate called from app service ");
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.setLoadingState(true);
    

    return this.http
      .get<any>(
        `${environment.api_url}/${this.getEndCallUrl}?appointmentId=${appointmentId}&userId=${userId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }

  private callSubject = new BehaviorSubject<CallInitModel>({} as CallInitModel);
  public call = this.callSubject.asObservable().pipe(distinctUntilChanged());
  public CheckCallStarted(callInitModel: CallInitModel) {
    this.callSubject.next(callInitModel);
  }


  getUrgentCareProviderActionInitiate(
    appointmentId: number,
    userId: number,
    //isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    //isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getUrgentCareProviderActionInitiateUrl}?appointmentId=${appointmentId}&userId=${userId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          //isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }

  private callProviderActionSubject = new BehaviorSubject<UrgentCareProviderActionInitModel>({} as UrgentCareProviderActionInitModel);
  public ProviderActioncall = this.callProviderActionSubject.asObservable();
  public ProviderActioncallStarted(callInitModel: UrgentCareProviderActionInitModel) {
    this.callProviderActionSubject.next(callInitModel);
  }

  getcallPatientInformProviderAvailability(
    appointmentId: number,
    userId: number,
    //isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token"),
      additionalHeaders: this.getAdditionalHeaders,
    });
    //isLoading && this.setLoadingState(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.getcallPatientInformProviderAvailabilityUrl}?appointmentId=${appointmentId}&userId=${userId}`,
        { headers: headers }
      )
      .pipe(
        map((res) => {
          //isLoading && this.setLoadingState(false);
          return res;
        })
      );
  }

}
const SystemIpAddress = new Promise((r) => {
  const w: any = window,
    a = new (w.RTCPeerConnection ||
      w.mozRTCPeerConnection ||
      w.webkitRTCPeerConnection)({ iceServers: [] }),
    b = () => {};
  a.createDataChannel("");
  a.createOffer((c) => a.setLocalDescription(c, b, b), b);
  a.onicecandidate = (c) => {
    try {
      c.candidate.candidate
        .match(
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        )
        .forEach(r);
    } catch (e) {}
  };
});
