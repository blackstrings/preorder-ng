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

  public static getAuthorizationHeaders2(token: string): HttpHeaders {
    if(token) {
      return new HttpHeaders({'authenticity_token': token});
    }
    console.error('<< HttpBuilders >> getAuthorizationHeaders failed, token null');
    return null;
  }

  public static getHttpOptionsWithAuthHeaders(token: string): HttpOptions {
    if(token) {
      return new HttpOptions(new HttpParams(), HttpBuilders.getAuthorizationHeaders(token));
    }
    console.error('<< HttpBuilders >> getHttOptionsWithAuthHeaders failed, token null');
    return null;
  }

  // replicated using header2
  public static getHttpOptionsWithAuthHeaders2(token: string): HttpOptions {
    if(token) {
      return new HttpOptions(new HttpParams(), HttpBuilders.getAuthorizationHeaders2(token));
    }
    console.error('<< HttpBuilders >> getHttOptionsWithAuthHeaders failed, token null');
    return null;
  }

  public static getHttpOptionsJSON(): HttpOptions {
    return new HttpOptions(new HttpParams(), HttpBuilders.getHttpHeadersJSON());
  }

  public static getHttpHeadersJSON(): HttpHeaders {
    return new HttpHeaders({'Content-Type': 'application/json'});
  }

}
