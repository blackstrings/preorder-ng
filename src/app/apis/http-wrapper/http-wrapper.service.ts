import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {ApiEndPoints} from "../api-end-points";
import {catchError, map, timeout} from "rxjs/operators";
import {HttpOptions} from "./http-options";
import {HttpErrorContainer} from "./http-error-container";

/**
 * The front end service to make any backend calls.
 * Holds all the api calls to backend services.
 * Should the end points grow large, create sub services.
 *
 * In http request, you usually build a url with [headers, body, params]
 */
@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService<T> {

  // the set the api version here so we can concate with the end points
  private apiVersion: string = ApiEndPoints.TARGET_VERSION;

  // todo test to create
  // private merchantCreateProduct: string = 'http://localhost:3000/merchants/1/products/new';

  // constructor
  constructor(private httpClient: HttpClient) {
    console.debug('<< HttpWrapper >> Init');
  }

  /**
   * Generic error handler for http calls
   * We can also handle specific backend server errors and properly construct the errors here.
   * @param error
   */
  private handleError(error: HttpErrorResponse): Observable<HttpErrorContainer> {
    const container: HttpErrorContainer = new HttpErrorContainer();
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      container.message = error.error.message;
    } else {
      // Server-side errors
      container.status = error.status;  // status code
      container.message = error.message;
    }
    return throwError(container);
  }

  /**
   * Returns user auth header for http calls
   * @throws error if token is null
   */
  private getUserAuthHeader(token: string): HttpHeaders {
    if(token) {
      const authHeader = new HttpHeaders({'Authorization': token});  //works
      // authHeader.append('Authorization', this.getAuthToken()); // doesn't seem to work after in init
      return authHeader;
    }
    throw new Error('<< HttpWrapper >> getUserAuthHeader failed, token null');
  }

  public post(uri: string, body: any = {}, httpOptions: HttpOptions = new HttpOptions(), timeout: number = 20000): Observable<T | HttpErrorContainer> {
    return this.postByLocation(this.apiVersion + uri, '', body, httpOptions, timeout);
  }

  public update(uri: string, body: any = {}, httpOptions: HttpOptions = new HttpOptions(), timeout: number = 20000): Observable<T | HttpErrorContainer> {
    return this.updateByLocation(this.apiVersion + uri, '', body, httpOptions, timeout);
  }

  public get(uri, httpOptions: HttpOptions = null, timeout: number = 20000): Observable<T | HttpErrorContainer> {
    return this.getByLocation('', this.apiVersion + uri, httpOptions, timeout);
  }

  public postByLocation(uri: string, location: string = '', body: any = null, options: HttpOptions = null, timeoutVal: number = 20000): Observable<T | HttpErrorContainer> {
    return this.httpClient
      .post<T>(location + uri, body, {params: options.params, headers: options.headers})
      .pipe(
        timeout(timeoutVal),
        map( (resp: T) => { return resp }),
        catchError(this.handleError)
      );
  }

  public updateByLocation(uri: string, location: string = '', body: any = null, options: HttpOptions = null, timeoutVal: number = 20000): Observable<T | HttpErrorContainer> {
    return this.httpClient
      .put<T>(location + uri, body, {params: options.params, headers: options.headers})
      .pipe(
        timeout(timeoutVal),
        map( (resp: T) => { return resp }),
        catchError(this.handleError)
      );
  }

  public getByLocation(location: string = '', uri: string, options: HttpOptions = null, timeoutVal: number = 20000): Observable<T | HttpErrorContainer> {
    return this.httpClient
      .get<T>(location + uri, {params: options.params, headers: options.headers})
      .pipe(
        timeout(timeoutVal),
        map( (resp: T) => { return resp }),
        catchError(this.handleError)
      );
  }

  /**
   * don't subscribe directly in the request if others wish to subscribe to the call.
   * Only return the observable.
   * @deprecated
   */
  // public login(email: string, pass: string): Observable<ResponseLogin | HttpErrorContainer> {
  //   this.body = {'email': email, 'password': pass};
  //   const url: string = this.apiVersion + ApiEndPoints.USER_LOGIN;
  //   return this.httpClient.post<ResponseLogin>(url, this.body, {params: this.params, headers: this.postHeadersJSON})
  //     .pipe(catchError(this.handleError));
  // }


  /**
   * call to get merchant products
   * @api api/version/merchants/merchant_id/products/
   * */
  /*
  public getMerchantProducts(merchantID: number, token: string): Observable<Product[] | HttpErrorContainer> {
    if(merchantID && token) {      const url: string = this.apiVersion + ApiEndPoints.MERCHANT
        + '/' + merchantID + '/' + ApiEndPoints.MERCHANT_PRODUCTS;

      return this.httpClient.get<Product[]>(url, this.getHttpOptions(token))
        .pipe(
          map(res => { return Product.deserializeAsArray(res) }),
          catchError(this.handleError)
        );
    }
    return throwError('<< HttpWrapper >> getMerchantProducts failed, id or token null');
  }
  */

  /**
   * By default httpclient returns the json in the body.
   * You can specified a return type Observable<HttpResponse<YourObject>> to
   * traverse into the headers and body for more specific data.
   */
  // public getMerchantList(token: string): Observable<Merchant[] | HttpErrorContainer> {
  //   if(token) {
  //     const url: string = this.apiVersion + ApiEndPoints.MERCHANT_LIST;
  //
  //     return this.httpClient.get<Merchant[]>(url, this.getHttpOptions(token))
  //       .pipe(
  //         map(res => { return <Merchant[]>res; }),
  //         catchError(this.handleError)
  //       );
  //   }
  //   return throwError('<< HttpWrapper >> getMerchantList failed, token null');
  // }

}
