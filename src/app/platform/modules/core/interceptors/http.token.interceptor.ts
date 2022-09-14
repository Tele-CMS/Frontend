import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let additionalHeaders;
    try {

      let apiUrl = new URL(req.url);
      const modifiedUrl = apiUrl.origin+apiUrl.pathname.replace(/\/\//g, "/") + apiUrl.search;
      additionalHeaders = req.headers.get("additionalHeaders") || "";
    // } catch (error) {
    //   additionalHeaders = "";
    // }
    const headerJson =
      (additionalHeaders && JSON.parse(additionalHeaders)) || {};
    // console.log(headerJson)
    const headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headerJson
    };

    if (localStorage.getItem("access_token")) {
      const token = JSON.parse(localStorage.getItem("access_token"));
      headersConfig["Authorization"] = `Bearer ${token}`;
    }

    const request = req.clone({ url: modifiedUrl, setHeaders: headersConfig });
    return next.handle(request);
  } catch (error) {
    additionalHeaders = "";
  }
  }
}
