import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, ReplaySubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LoginUser } from "../modals/loginUser.modal";
import { environment } from "../../../../environments/environment";

@Injectable()
export class CommonService {
  private SytemInfoSubject = new BehaviorSubject<any>({});
  public sytemInfo = this.SytemInfoSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public loginUserSubject = new BehaviorSubject<LoginUser>({} as LoginUser);
  public loginUser = this.loginUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public loginSecuritySubject = new BehaviorSubject<any>({} as object);
  public loginSecurity = this.loginSecuritySubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  public loadingState = this.loadingStateSubject.asObservable();

  // for update the client side navigations ...
  private updateClientNavigationSubject = new BehaviorSubject<
    any
  >(null as number);
  public updateClientNavigation = this.updateClientNavigationSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {
    SystemIpAddress.then(value => {
      this.SytemInfoSubject.next({ ipAddress: value });
    }).catch(e => console.error(e));
  }
  setLoadinState(isLoading: boolean = false) {
    this.loadingStateSubject.next(isLoading);
  }
  initializeAuthData() {
    if (localStorage.getItem("super-user-token")) {
      return this.http
        .get<any>(`${environment.api_url}/GetUserByToken`)
        .subscribe(response => {
          // login successful if there's a jwt token in the response
          if (response && response.access_token) {
            this.setAuth(response);
          } else {
            this.purgeAuth();
          }
          return response;
        });
    }
  }
  isValidFileType(fileName, fileType): boolean {
    // Create an object for all extension lists
    let extentionLists = { video: [], image: [], pdf: [], excel: [], xml: [] };
    let isValidType = false;
    extentionLists.video = ["m4v", "avi", "mpg", "mp4"];
    extentionLists.image = ["jpg", "jpeg", "bmp", "png", "ico"];
    extentionLists.pdf = ["pdf"];
    extentionLists.excel = ["excel"];
    extentionLists.xml = ["xml"];
    //get the extension of the selected file.
    let fileExtension = fileName
      .split(".")
      .pop()
      .toLowerCase();
    isValidType = extentionLists[fileType].indexOf(fileExtension) > -1;
    return isValidType;
  }
  logout() {
    // remove user from local storage to log user out
    this.purgeAuth();
  }

  setAuth(user: LoginUser) {
    localStorage.setItem("super-user-token", JSON.stringify(user.access_token));
    // Set current user data into observable
    this.loginUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    localStorage.removeItem("super-user-token");
    // Set current user to an empty object
    this.loginUserSubject.next({} as LoginUser);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  getLoginUserInfo(): LoginUser {
    return this.loginUserSubject.value;
  }

  getCurrentLoginLocationId(): string {
    let locationId: string = "";
    const loginData: LoginUser = this.loginUserSubject.value;
    if (loginData && loginData.data) {
      locationId =
        loginData.data.staffLocation[0] &&
        loginData.data.staffLocation[0].locationID;
    }
    return locationId.toString();
  }

  getSystemIpAddress(): string {
    return this.SytemInfoSubject.value && this.SytemInfoSubject.value.ipAddress;
  }

  updateClientNaviagations(clientId: number) {
    this.updateClientNavigationSubject.next(clientId);
  }

  get getAdditionalHeaders(): string {
    const additionalHeaders = JSON.stringify({
      Offset: new Date().getTimezoneOffset().toString(),
      Timezone: calculateTimeZone(),
      IPAddress: this.getSystemIpAddress()
    });
    return additionalHeaders;
  }

  post(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    return this.http.post<any>(`${environment.api_url}/${url}`, data, {
      headers: headers
    });
  }

  put(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    return this.http.put<any>(`${environment.api_url}/${url}`, data, {
      headers: headers
    });
  }

  getById(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map(res => {
          this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getAll(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map(res => {
          this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  delete(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    return this.http.delete<any>(`${environment.api_url}/${url}`, {
      headers: headers
    });
  }
  patch(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders
    });
    this.loadingStateSubject.next(true);
    return this.http
      .patch<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map(res => {
          this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  download(url, headers): Observable<Blob> {
    return this.http.get(`${environment.api_url}/${url}`, {
      headers: headers,
      responseType: "blob"
    });
  }
}

const SystemIpAddress = new Promise(r => {
  const w: any = window,
    a = new (w.RTCPeerConnection ||
      w.mozRTCPeerConnection ||
      w.webkitRTCPeerConnection)({ iceServers: [] }),
    b = () => {};
  a.createDataChannel("");
  a.createOffer(c => a.setLocalDescription(c, b, b), b);
  a.onicecandidate = c => {
    try {
      c.candidate.candidate
        .match(
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        )
        .forEach(r);
    } catch (e) {}
  };
});

function calculateTimeZone(dateInput?: Date): string {
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
