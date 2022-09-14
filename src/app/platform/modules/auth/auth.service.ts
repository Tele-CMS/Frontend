import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { CommonService } from "../core/services/common.service";
import { environment } from "../../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  login(postData: any) {
    this.commonService.setSecurityQuestions({} as object);
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    return this.http
      .post<any>(`${environment.api_url}/Login/login`, postData, {
        headers: headers
      })
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          if (response && response.access_token) {
            this.commonService.setAuth(response);
          } else if (response && response.data) {
            this.commonService.setSecurityQuestions({
              loginResponse: response,
              authData: postData
            });
          }
          return response;
        })
      );
  }
  clientLogin(postData: any) {
    this.commonService.setSecurityQuestions({} as object);
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    return this.http
      .post<any>(`${environment.api_url}/Login/PatientLogin`, postData, {
        headers: headers
      })
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          if (response && response.access_token) {
            this.commonService.setAuth(response);
          } else if (response && response.data) {
            this.commonService.setSecurityQuestions({
              loginResponse: response,
              authData: postData
            });
          }
          return response;
        })
      );
  }

  saveSecurityQuestion(postData: any) {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    return this.http
      .post<any>(
        `${environment.api_url}/Login/SaveUserSecurityQuestion`,
        postData,
        { headers: headers }
      )
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          if (response && response.access_token) {
            this.commonService.setAuth(response);
          }
          return response;
        })
      );
  }
  checkQuestionAnswer(postData: any) {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    return this.http
      .post<any>(`${environment.api_url}/Login/CheckQuestionAnswer`, postData, {
        headers: headers
      })
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          if (response && response.access_token) {
            this.commonService.setAuth(response);
          }
          return response;
        })
      );
  }
  forgotPassword(postData: any) {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    return this.http
      .post<any>(`${environment.api_url}/ForgotPassword`, postData, {
        headers: headers
      })
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          return response;
        })
      );
  }
  resetPassword(postData: any) {
    const headers = new HttpHeaders({
      businessToken: localStorage.getItem("business_token")
    });
    return this.http
      .patch<any>(`${environment.api_url}/Home/UpdatePassword`, postData, {
        headers: headers
      })
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          return response;
        })
      );
  }


  // SetUserOffline() {
  //   
  //   const headers = new HttpHeaders({
  //     businessToken: localStorage.getItem("business_token")
  //   });
  //   return this.http
  //     .patch<any>(`${environment.api_url}/Login/Logout`, {
  //       headers: headers
  //     })
  //     .pipe(
  //       map(response => {
          
  //         return response;
  //       })
  //     );
  // }

  SetUserOffline() {
   
      return this.http
        .get<any>(`${environment.api_url}/Login/SetUserOffline`)
        .subscribe((response) => {
         
          return response;
        });
   
  }

  sideScreenImgSrc = new BehaviorSubject<string>('');

  updateSideScreenImgSrc(path:string){
    this.sideScreenImgSrc.next(path);
  }
  getSideScreenImgSrc(): Observable<string> {
    return this.sideScreenImgSrc.asObservable();
  }
  clearSideScreenImgSrc(){
    this.sideScreenImgSrc.next('');
  }
}
