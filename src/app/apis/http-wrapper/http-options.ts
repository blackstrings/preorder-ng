import {HttpHeaders, HttpParams} from "@angular/common/http";

export class HttpOptions {
  constructor(public params: HttpParams = new HttpParams(), public headers: HttpHeaders = new HttpHeaders()) {

  }
}
