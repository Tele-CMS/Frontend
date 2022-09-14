import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, ReplaySubject, BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";
import { map } from "rxjs/operators";

@Injectable()
export class SubDomainService {
  private subject = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

  getSubDomainUrl() {
    let hostName = window.location.host;
    let subdomain = null;
    // @if running on localhost or (34.211.31.84:8017) server

    if (
      hostName === "localhost:4200" || 
      hostName === "34.211.31.84:8069" ||
      "172.31.28.109:4500" ||
      "54.191.156.102:4500" ||
      "75.126.168.31:6044" ||
      // "www.stagingwin.com:3133"
       "www.stagingwin.com:3131"
      //"www.stagingwin.com:3135"
    ) {
      hostName = "sdm.smarthealth.net.in";
    }

    const splitHostName = hostName.split(".");
    if (splitHostName.length >= 4) {
      subdomain = splitHostName[0];
    }
    return subdomain;
  }

  getSubDomainInfo(): Observable<any> {
    return this.subject.asObservable();
  }

  verifyBusinessName(domainName: string) {
    return this.http
      .get<any>(
        `${environment.api_url}/VerifyBusinessName?BusinessName=${domainName}`
      )
      .pipe(
        map(response => {
          if (response.statusCode === 200) {
            localStorage.setItem("business_token", response.data.businessToken);
            this.subject.next({ ...response.data });
          } else {
            localStorage.removeItem("business_token");
            this.subject.next(null);
          }
        })
      );
  }

  updateFavicon(faviconUrl: string) {
    let link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = faviconUrl;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}
