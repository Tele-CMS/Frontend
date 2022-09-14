import { Injectable } from "@angular/core";
import { CommonService } from "src/app/platform/modules/core/services";
import { Observable, Subject } from "rxjs";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class RegisterService {
  private checkTokenAccessibilityUrl: string = "UserRegister/CheckTokenAccessibility?id=";
  private registerNewUserUrl: string = "UserRegister/RegisterWithToken";
  private registerNewUserWithoutTokenUrl: string = "UserRegister/Register";
  private rejectInvitationUrl: string = "UserRegister/RejectInvitation";
  private checkUsernameUrl: string = "UserRegister/CheckUsernameExistance?username=";
  private masterDataUrl: string = "UserRegister/MasterDataByName";
  private loadingStateSubject = new Subject<boolean>();
  public loadingState = this.loadingStateSubject.asObservable();
  constructor(private commonService: CommonService, private http: HttpClient) {}

  checkTokenAccessibility(
    id: string,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(
        `${environment.api_url}/${this.checkTokenAccessibilityUrl}${id}`,
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }
  registerNewUser(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.registerNewUserUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
    //return this.commonService.post(`${this.registerNewUserUrl}`, postData);
  }
  registerNewUserWithoutToken(
    postData: any,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.registerNewUserWithoutTokenUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
    //return this.commonService.post(`${this.registerNewUserUrl}`, postData);
  }
  getMasterData(
    value: string = "",
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.masterDataUrl}`,
        { masterdata: value },
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  checkUserNameExistance(
    username: string,
    isLoading: boolean = true
  ): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.loadingStateSubject.next(true);
    let url = `${environment.api_url}/${this.checkUsernameUrl}${username}`;
    return this.http.get<any>(url, { headers: headers }).pipe(
      map(res => {
        isLoading && this.loadingStateSubject.next(false);
        return res;
      })
    );
    //return this.commonService.post(`${this.registerNewUserUrl}`, postData);
  }
  rejectInvitation(postData: any, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(
        `${environment.api_url}/${this.rejectInvitationUrl}`,
        postData,
        { headers: headers }
      )
      .pipe(
        map(res => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
    //return this.commonService.post(`${this.registerNewUserUrl}`, postData);
  }
}
