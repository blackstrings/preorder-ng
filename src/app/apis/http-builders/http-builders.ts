import {HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpOptions} from "../http-wrapper/http-options";

export class HttpBuilders {
  public static getAuthorizationHeaders(token: string): HttpHeaders {
    if(token) {
      return new HttpHeaders({'Authorization': token});  //works
    }
    console.error('<< HttpBuilders >> getAuthorizationHeaders failed, token null');
    return null;
  }

  public static getHttOptionsWithAuthHeaders(token: string): HttpOptions {
    if(token) {
      return new HttpOptions(new HttpParams(), HttpBuilders.getAuthorizationHeaders(token));
    }
    console.error('<< HttpBuilders >> getHttOptionsWithAuthHeaders failed, token null');
    return null;
  }
}
