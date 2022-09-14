import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../core/services/common.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService {
    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    login(postData: any) {
        return this.http.post<any>(`${environment.api_url}/api/SuperAdmin/Login`, postData)
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                if (response && response.access_token) {
                    this.commonService.setAuth(response);
                }
                return response;
            }));
    }
    refreshAuthToken() {
        return this.http.get<any>(`${environment.api_url}/GetUserByToken`)
            .subscribe(response => {
                // login successful if there's a jwt token in the response
                if (response && response.access_token) {
                    this.commonService.setAuth(response);
                } else {
                    this.commonService.purgeAuth();
                }
                return response;
            });
    }

    forgotPassword(postData: any) {
        const headers = new HttpHeaders({
            'businessToken': localStorage.getItem('business_token'),
        });
        return this.http.post<any>(`${environment.api_url}/ForgotPassword`, postData, { headers: headers })
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                return response;
            }));
    }
    logout() {
        // remove user from local storage to log user out
        this.commonService.purgeAuth();
    }

}
