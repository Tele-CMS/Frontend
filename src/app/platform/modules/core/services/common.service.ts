import { ICDCodeService } from "./../../agency-portal/masters/icd-codes/icd-code.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, ReplaySubject, Observable, Subject } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LoginUser, ProfileSetupModel } from "../modals/loginUser.modal";
import { environment } from "../../../../../environments/environment";
import * as CryptoJS from "crypto-js";
import base64 from "base-64";
import utf8 from "utf8";
import { AppointmentViewComponent } from "../../scheduling/appointment-view/appointment-view.component";
import { MatDialog } from "@angular/material";
import { SaveDocumentComponent } from "src/app/front/save-document/save-document.component";



@Injectable()
export class CommonService {

  private videoSessionStartedSubject = new BehaviorSubject<any>({
    IsStarted: false,
  });
  public videoSessionStarted = this.videoSessionStartedSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  private SytemInfoSubject = new BehaviorSubject<any>({});
  public sytemInfo = this.SytemInfoSubject.asObservable().pipe(
    distinctUntilChanged()
  );

  public loginUserSubject = new BehaviorSubject<LoginUser>({} as LoginUser);
  public loginUser = this.loginUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private chatNavigationSubject = new BehaviorSubject<any>({} as any);
  public chatNavigationData = this.chatNavigationSubject.asObservable().pipe(distinctUntilChanged());

  public currentLoginUserInfoSubject = new BehaviorSubject<any>(null);
  public currentLoginUserInfo = this.currentLoginUserInfoSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public loginSecuritySubject = new BehaviorSubject<any>({} as object);
  public loginSecurity = this.loginSecuritySubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  private isPatientSubject = new BehaviorSubject<boolean>(false);
  public isPatient = this.isPatientSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string>("");
  public userRole = this.userRoleSubject.asObservable();

  public appointmentDataSubject = new BehaviorSubject<number>(0);
  public appointmentData = this.appointmentDataSubject.asObservable();

  public loadingStateSubject = new Subject<boolean>();
  public loadingState = this.loadingStateSubject.asObservable();
  private checkStaffProfile = "Staffs/CheckStaffProfile?id=";
  // for update the client side navigations ...
  private updateClientNavigationSubject = new BehaviorSubject<any>({} as any);
  public updateClientNavigation = this.updateClientNavigationSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private _isProfileComplete = new BehaviorSubject<ProfileSetupModel>(
    {} as ProfileSetupModel
  );
  isProfileComplete = this._isProfileComplete.asObservable();

  private messageNotificationSubject = new BehaviorSubject<any>({} as any);
  public messageNotificationData = this.messageNotificationSubject.asObservable().pipe(distinctUntilChanged());
  
  private chatUserStatusSubject = new BehaviorSubject<any>({} as any);
  public chatUserStatusData = this.chatUserStatusSubject.asObservable().pipe(distinctUntilChanged());
  loggedInUserData:any = [];
  constructor(private http: HttpClient) {
    SystemIpAddress.then((value) => {
      this.SytemInfoSubject.next({ ipAddress: value });
    }).catch((e) => console.error(e));

    this.http
    .get<any>(`${environment.api_url}/GetUserByToken`)
    .subscribe((response) => {
      // login successful if there's a jwt token in the response
       this.loggedInUserData = response
      
    });
  }
  setIsProfileComplete(data) {
    this._isProfileComplete.next(data);
  }

  videoSession(isStarted: boolean) {
    if (!isStarted) localStorage.removeItem("otSession");
    this.videoSessionStartedSubject.next({ IsStarted: isStarted });
  }
  getFullName(firstName: string, middleName: string, lastName: string) {
    return middleName != ""
      ? lastName != ""
        ? firstName + " " + middleName + " " + lastName
        : firstName + " " + middleName
      : firstName + " " + lastName;
  }
  initializeAuthData() {
    if (localStorage.getItem("access_token")) {
      return this.http
        .get<any>(`${environment.api_url}/GetUserByToken`)
        .subscribe((response) => {
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
    let fileExtension = fileName.split(".").pop().toLowerCase();
    isValidType = extentionLists[fileType].indexOf(fileExtension) > -1;
    return isValidType;
  }
  logout() {
    // remove user from local storage to log user out
    this.purgeAuth();
  }

  setAuth(user: LoginUser) {

    // const userRoleName =
    //   user.data.users3 && user.data.users3.userRoles.userType;
    // if ((userRoleName || "").toUpperCase() != "CLIENT")
    //   this.isProfileUpdated(user.data.id);
    localStorage.setItem("access_token", JSON.stringify(user.access_token));
    // Set current user data into observable 
    this.loginUserSubject.next(user);
    let locationid = user.data.staffLocation &&
      user.data.staffLocation[0] &&
      user.data.staffLocation[0].locationID;
    this.currentLoginUserInfoSubject.next({
      ...user.data,
      currentLocationId: locationid == undefined ? user.data.locationID : locationid,
      userLocations: user.userLocations || [],
    });
    // this.currentLoginUserInfoSubject.next({
    //   ...user.data,
    //   currentLocationId:
    //     user.data.staffLocation &&
    //     user.data.staffLocation[0] &&
    //     user.data.staffLocation[0].locationID,
    //   userLocations: user.userLocations || [],
    // });
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
    const userRoleName =
      user.data.users3 && user.data.users3.userRoles.userType;
    this.userRoleSubject.next(userRoleName);
  }
  setIsPatient(isPatient: boolean = true) {
    this.isPatientSubject.next(isPatient);
  }
  purgeAuth() {
    localStorage.removeItem("access_token");
    // Set current user to an empty object
    this.loginUserSubject.next({} as LoginUser);

    this.currentLoginUserInfoSubject.next(null);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  setSecurityQuestions(securityQuestionObj: object) {
    this.loginSecuritySubject.next(securityQuestionObj);
  }

  getLoginUserInfo(): any {
    return this.loginUserSubject.value;
  }

  getCurrentLoginLocationId(): string {

    let locationId: string = "";
    const loginData: any = this.currentLoginUserInfoSubject.value;
    if (loginData) {
      locationId = loginData.currentLocationId || 0;
    }
    return locationId.toString();
  }

  getSystemIpAddress(): string {
    return this.SytemInfoSubject.value && this.SytemInfoSubject.value.ipAddress;
  }

  updateCurrentLoginUserInfo(locationId: number) {
    const loginData: any = this.currentLoginUserInfoSubject.value;
    if (loginData) {
      const newUserObj = {
        ...loginData,
        currentLocationId: locationId,
      };
      this.currentLoginUserInfoSubject.next(newUserObj);
    }
  }

  updateClientNaviagations(clientId: number, userId: number = null) {
    this.updateClientNavigationSubject.next({ clientId, userId });
  }

  get getAdditionalHeaders(): string {
    const additionalHeaders = JSON.stringify({
      Offset: new Date().getTimezoneOffset().toString(),
      Timezone: calculateTimeZone(),
      IPAddress: this.getSystemIpAddress(),
      LocationID: this.getCurrentLoginLocationId(),
      BusinessToken: localStorage.getItem("business_token")
    });
    return additionalHeaders;
  }


  post(url, data, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .post<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  get(url, isLoading: boolean = false): Observable<any> {
    isLoading && this.loadingStateSubject.next(true);
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });

    return this.http.get<any>(`${environment.api_url}/${url}`, {
      headers: headers,
    })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }


  put(url, data): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    return this.http.put<any>(`${environment.api_url}/${url}`, data, {
      headers: headers,
    });
  }

  getById(url, data, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  getAll(url, data, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .get<any>(`${environment.api_url}/${url}`, { headers: headers })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }


  delete(url): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    return this.http.delete<any>(`${environment.api_url}/${url}`, {
      headers: headers,
    });
  }
  patch(url, data, isLoading: boolean = true): Observable<any> {
    const headers = new HttpHeaders({
      additionalHeaders: this.getAdditionalHeaders,
    });
    isLoading && this.loadingStateSubject.next(true);
    return this.http
      .patch<any>(`${environment.api_url}/${url}`, data, { headers: headers })
      .pipe(
        map((res) => {
          isLoading && this.loadingStateSubject.next(false);
          return res;
        })
      );
  }

  download(url, headers): Observable<Blob> {
    return this.http.get(`${environment.api_url}/${url}`, {
      headers: headers,
      responseType: "blob",
    });
  }
  calculateFileSizehandler(files): boolean {
    let totalFileSize = 0;
    let fileSizeInKB;
    // @desc - define const max upload file size 5MB
    let totalFileSizeInMB;
    const fileSize5MB = "5.00";
    files.map((obj, i) => {
      totalFileSize = totalFileSize + obj.size;
      totalFileSizeInMB = (totalFileSize / 1024 / 1024).toFixed(2);
      fileSizeInKB = Math.round(obj.size / 1024); // converted bytes(incoming file size) to KB.
      // 1024kb = 1MB
      let fileSizeInMB = Math.round(obj.size / 1024 / 1024);
      let fileSizeInMBFixTo2Decimal = fileSizeInMB.toFixed(2);
      return fileSizeInKB >= 1024
        ? `${fileSizeInMBFixTo2Decimal}MB`
        : `${fileSizeInKB}KB`;
    });

    if (
      parseFloat(fileSizeInKB) === 0.0 ||
      parseFloat(totalFileSizeInMB) > parseFloat(fileSize5MB)
    ) {
      return false;
    } else {
      return true;
    }
  }

  encryptValue(value: any, isEncrypt: boolean = true): any {
    let response: any;
    if (value != null && value != "") {
      let pwd = "HCPRODUCT#!_2018@";
      let bytes: any;
      if (isEncrypt) {
        bytes = utf8.encode(value.toString());
        response = base64.encode(bytes);
        //response = CryptoJS.AES.encrypt(JSON.stringify(value), pwd);
      } else {
        bytes = base64.decode(value);
        response = utf8.decode(bytes);
        // const bytes = CryptoJS.AES.decrypt(value, pwd);
        // if (bytes.toString()) {
        //   response= JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // }
        //      response = CryptoJS.AES.decrypt(value, pwd);//.toString(CryptoJS.enc.Utf8);
      }
    }
    return response;
  }

  onPatientChatNavigation(patientData: any) {
    this.chatNavigationSubject.next(Object.assign({}, ...patientData));
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {

    const returnObj = {};
    const loginData: LoginUser = this.loginUserSubject.value;
    if (loginData.userPermission) {
      console.log("user permission",loginData.userPermission)
      const modules = loginData.userPermission.modulePermissions || [],
        screens = loginData.userPermission.screenPermissions || [],
        actions = loginData.userPermission.actionPermissions || [],
        userRoleName =
          loginData.data.users3 && loginData.data.users3.userRoles.userType,
        isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN";

      const moduleobj = modules.find((obj) => obj.moduleKey == moduleName);
      const screenObj = screens.find(
        (obj) =>
          obj.screenKey == screenName &&
          obj.moduleId == (moduleobj && moduleobj.moduleId)
      );

      const actionPermissions =
        actions.filter(
          (obj) => obj.screenId == (screenObj && screenObj.screenId)
        ) || [];

      actionPermissions.forEach((obj) => {
        returnObj[obj.actionKey] = obj.permission || isAdminLogin;
      });
    }
    return returnObj;
  }

  getUserScreenModulePermissions(moduleName: string, screenName: string): any {

    const returnObj = {};
    const loginData: LoginUser = this.loginUserSubject.value;
    if (loginData.userPermission) {
      console.log("user permission",loginData.userPermission)
      const modules = loginData.userPermission.modulePermissions || [],
        screens = loginData.userPermission.screenPermissions || [],
        actions = loginData.userPermission.actionPermissions || [],
        userRoleName =
          loginData.data.users3 && loginData.data.users3.userRoles.userType,
        isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN";

      const moduleobj = modules.find((obj) => obj.moduleKey == moduleName);
     
    //   const screenObj = screens.find(
    //     (obj) =>
    //       obj.screenKey == screenName &&
    //       obj.moduleId == (moduleobj && moduleobj.moduleId)
    //   );

    //   const actionPermissions =
    //     actions.filter(
    //       (obj) => obj.screenId == (screenObj && screenObj.screenId)
    //     ) || [];

    //   actionPermissions.forEach((obj) => {
    //     returnObj[obj.actionKey] = obj.permission || isAdminLogin;
    //   });
    return moduleobj;
     }
   
  }
  getProfileUpdated(staffId: number): Observable<any> {
    return this.getById(this.checkStaffProfile + staffId, {});
  }
  isProfileUpdated(staffId: number) {
    if (staffId !== null || staffId !== undefined) {
      this.getProfileUpdated(staffId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.setIsProfileComplete(res.data as ProfileSetupModel);
        } else {
          let profile = new ProfileSetupModel();
          this.setIsProfileComplete(profile);
        }
      });
    }

    return false;
  }






  isRoutePermission(routeName: string): boolean {
    //this.isProfileUpdated(this.loginUserSubject.value.data.id);
    let changedRouteName = routeName.replace("/web", "");
    if (changedRouteName.length) {
      const index = changedRouteName.indexOf("?");
      changedRouteName = changedRouteName.substring(
        0,
        index != -1 ? index : changedRouteName.length
      );
    }
    let permission = false;
    // Added Exception as per discussoon with Rishi- User Can Add/Edit his profile without Role permission.
    if (changedRouteName == "/manage-users/user-profile") {
      permission = true;
      return permission;
    }
    const loginData: LoginUser = this.loginUserSubject.value,
      userRoleName =
        loginData.data &&
        loginData.data.users3 &&
        loginData.data.users3.userRoles.userType;
    if (
      loginData.userPermission &&
      ((userRoleName || "").toUpperCase() == "STAFF" ||
        (userRoleName || "").toUpperCase() == "PROVIDER" ||
        (userRoleName || "").toUpperCase() == "ADMIN")
    ) {
      const modules = loginData.userPermission.modulePermissions || [],
        screens = loginData.userPermission.screenPermissions || [],
        isAdminLogin = (userRoleName || "").toUpperCase() == "ADMIN";

      const moduleobj = modules.find(
        (obj) => obj.navigationLink == changedRouteName
      );
      if (moduleobj) {
        permission = moduleobj.permission || isAdminLogin;
      } else {
        // routing changes due to some conditions ....
        if (changedRouteName.includes("/Masters"))
          changedRouteName = changedRouteName.replace("/Masters", "");
        if (changedRouteName.includes("/manage-users"))
          changedRouteName = changedRouteName.replace("/manage-users", "");
        if (changedRouteName.includes("/payment"))
          changedRouteName = changedRouteName.replace("/payment", "");
        if (changedRouteName.includes("/Billing"))
          changedRouteName = changedRouteName.replace("/Billing", "");
        if (changedRouteName.includes("/Logs"))
          changedRouteName = changedRouteName.replace("/Logs", "");

        const screenObj = screens.find(
          (obj) => obj.navigationLink == changedRouteName
        );
        permission = (screenObj && screenObj.permission) || isAdminLogin;
      }

      if (changedRouteName == "/user" && !permission) {
        const encryptId = decodeURIComponent(routeName).replace(
          "/web/manage-users/user?id=",
          ""
        ),
          decUserId =
            encryptId &&
            !encryptId.includes("/web/manage-users/user") &&
            this.encryptValue(encryptId, false);
        if (decUserId == loginData.data.id) permission = true;
      }
      if((userRoleName || "").toUpperCase() == "PROVIDER" || (userRoleName || "").toUpperCase() == "ADMIN" || (userRoleName || "").toUpperCase() == "STAFF" && (changedRouteName.includes("/questionnaire") || changedRouteName.includes("/questionnaire/questionnaire-details"))){
        return permission = true;
    }
    }

    return permission;
  }

  isRoutePermissionForClient(routeName: string) { 
    routeName = routeName.replace("/web", "");
    if (routeName.length) {
      const index = routeName.indexOf("?");
      routeName = routeName.substring(
        0,
        index != -1 ? index : routeName.length
      );
    }
    let permission = false; 

  return this.http
    .get<any>(`${environment.api_url}/GetUserByToken`)
    .subscribe((response) => {
      // login successful if there's a jwt token in the response
      const loginData: LoginUser = response,
      userRoleName =
        loginData.data &&
        loginData.data.users3 &&
        loginData.data.users3.userRoles.userType;
    if (
      !loginData.userPermission &&
      (userRoleName || "").toUpperCase() == "CLIENT"
    ) {
      const screens = [
        { navigationLink: "/client/dashboard", permission: true },
        { navigationLink: "/client/my-scheduling", permission: true },
        // { navigationLink: "/client/payment-history", permission: true },
        // { navigationLink: "/client/refund-history", permission: true },
        { navigationLink: "/client/payment", permission: true },
        { navigationLink: "/client/payment/payment-history", permission: true },
        { navigationLink: "/client/payment/refund-history", permission: true },
        { navigationLink: "/client/my-profile", permission: true },
        { navigationLink: "/client/waiting-room", permission: true },
        { navigationLink: "/client/history", permission: true },
        { navigationLink: "/client/history/my-family-history", permission: true },
        { navigationLink: "/client/history/my-social-history", permission: true },
        //{ navigationLink: "/client/my-family-history", permission: true },
        //{ navigationLink: "/client/my-social-history", permission: true },
        { navigationLink: "/client/my-vitals", permission: true },
        { navigationLink: "/client/my-documents", permission: true },
        { navigationLink: "/client/mailbox", permission: true },
        { navigationLink: "/client/assigned-documents", permission: true },
        { navigationLink: "/client/soap-note", permission: true },
        { navigationLink: "/client/client-profile", permission: true },
        { navigationLink: "/client/address", permission: true },
        { navigationLink: "/client/review-rating", permission: true },
        { navigationLink: "/client/review-ratingList", permission: true },
        { navigationLink: "/client/symptom-checker", permission: true },
        { navigationLink: "/client/symptom-checker", permission: true },
        { navigationLink: "/client/my-assessments", permission: true },
        // { navigationLink: "/client/health-e-score", permission: true },
        { navigationLink: "/client/my-encounters",  permission: true },
        { navigationLink: '/client/my-programs',  permission: true },
        // { navigationLink: '/client/my-medications/current',  permission: true },
        // { navigationLink: '/client/my-medications/claim',  permission: true },
        { navigationLink: '/client/my-medications',  permission: true },
        { navigationLink: '/client/doctor-list',  permission: true },
        { navigationLink: '/client/chat',  permission: true },
        { navigationLink: '/client/my-diagnosis',  permission: true },
        { navigationLink: '/client/onboarding',  permission: true },
        { navigationLink: '/client/onboarding/section',  permission: true },

      ];

      const screenObj = screens.find((obj) => obj.navigationLink == routeName);
      permission = screenObj && screenObj.permission;
      return permission;
    }   
    });

    
    // console.log("permission ",permission)
    // return permission;
  }


  parseStringToHTML(str) {
    var dom = document.createElement('div');
    dom.innerHTML = str;
    return dom.firstChild;

  }

  updateMessageNotification(messageNoti: any) {
    this.messageNotificationSubject.next(Object.assign({}, ...messageNoti));
  }

  updateUserStatus(user: any) {
    this.chatUserStatusSubject.next(Object.assign({}, ...user));
  }
  

}

const SystemIpAddress = new Promise((r) => {
  const w: any = window,
    a = new (w.RTCPeerConnection ||
      w.mozRTCPeerConnection ||
      w.webkitRTCPeerConnection)({ iceServers: [] }),
    b = () => { };
  a.createDataChannel("");
  a.createOffer((c) => a.setLocalDescription(c, b, b), b);
  a.onicecandidate = (c) => {
    try {
      c.candidate.candidate
        .match(
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        )
        .forEach(r);
    } catch (e) { }
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
