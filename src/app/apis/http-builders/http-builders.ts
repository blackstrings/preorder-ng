import {HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpOptions} from "../http-wrapper/http-options";

export class HttpBuilders {

  public static getAuthorizationHeaders(token: string, asJson: boolean): HttpHeaders {
    if(token) {
      const http: HttpHeaders = new HttpHeaders({'Authorization': token});  //works

      if(asJson) {
        http.append('content-type', 'application/json');
      }
      return http;
    }
    console.error('<< HttpBuilders >> getAuthorizationHeaders failed, token null');
    return null;
  }

  /**
   *  Returns HttpOptions with default settings and token as authorization in header
   * @param token to use as authorization
   * @param asJson true by default, will set content-type as application/json
   */
  public static getHttpOptionsWithAuthHeaders(token: string, asJson: boolean = true): HttpOptions {
    if(token) {
      return new HttpOptions(new HttpParams(), HttpBuilders.getAuthorizationHeaders(token, asJson));
    }
    console.error('<< HttpBuilders >> getHttOptionsWithAuthHeaders failed, token null');
    return null;
  }


}
