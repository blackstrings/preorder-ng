import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, of, ReplaySubject, throwError} from "rxjs";
import {ApiEndPoints} from "../api-end-points";
import {catchError, map} from "rxjs/operators";
import {Product} from "../../models/product";
import {Merchant} from "../../models/merchant/merchant";
import {UserService} from "../../services/user-service/user.service";
import {ResponseLogin} from "../responses/response-login";

/**
 * The front end service to make any backend calls.
 * Holds all the api calls to backend services.
 * Should the end points grow large, create sub services.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {

  // http default configs - sets the commonly used default type of headers for sending over http request
  private postHeadersJSON: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private postOptionsJSON = {headers: this.postHeadersJSON, body: null, pathParams: new HttpParams()};

  private body = null;
  private params: HttpParams = new HttpParams();

  // the set the api version here so we can concate with the end points
  private apiVersion: string = ApiEndPoints.TARGET_VERSION;

  // login subscription
  private _onLogin: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public onLogin: Observable<boolean> = this._onLogin.asObservable();

  private selectedMerchant: Merchant;

  // todo test to create
  // private merchantCreateProduct: string = 'http://localhost:3000/merchants/1/products/new';

  // constructor
  constructor(private httpClient: HttpClient, private userService: UserService) {
  }

  /**
   * Generic error handler for http calls
   * @param error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // API calls to backend all below here

  private getHttpOptions(token: string): {params: HttpParams, headers: HttpHeaders} {
    if(token) {
      const headers: HttpHeaders = this.getUserAuthHeader(token);
      if(headers) {
        return {params: this.params, headers: headers};
      } else {
        console.error('<< HttpWrapper >> getHttpOptions failed, headers null');
      }
    } else {
      console.error('<< HttpWrapper >> getHttpOptions failed, token null');
    }
    throw new Error('<< HttpWrapper >> getHttpOptions failed, check call');
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

  public login(email: string, pass: string): Observable<ResponseLogin> {
    this.body = {'email': email, 'password': pass};
    const url: string = this.apiVersion + ApiEndPoints.USER_LOGIN;
    return this.httpClient.post<ResponseLogin>(url, this.body, {params: this.params, headers: this.postHeadersJSON})
      .pipe(catchError(this.handleError));
  }

  public logout(): Observable<{}> {
    console.warn('todo logout from backend not fully wired yet');
    if(this.userService.getAuthToken()){
      return this.httpClient.post(ApiEndPoints.USER_LOGOUT, null)
        .pipe(catchError(this.handleError));
    }
    return throwError('<< HttpWrapper >> Logout backend unnecessary, token is null, logging out on frontend');
  }

  /**
   * call to get merchant products
   * @api api/version/merchants/merchant_id/products/
   * */
  public getMerchantProducts(merchantID: number, token: string): Observable<Product[]> {
    if(merchantID && token) {
      const url: string = this.apiVersion + ApiEndPoints.MERCHANT
        + '/' + merchantID + '/' + ApiEndPoints.MERCHANT_PRODUCTS;

      return this.httpClient.get<Product[]>(url, this.getHttpOptions(token))
        .pipe(
          map(res => { return Product.deserializeAsArray(res) }),
          catchError(this.handleError)
        );
    }
    return throwError('<< HttpWrapper >> getMerchantProducts failed, id or token null');
  }

  /**
   * By default httpclient returns the json in the body.
   * You can specified a return type Observable<HttpResponse<YourObject>> to
   * traverse into the headers and body for more specific data.
   */
  public getMerchantList(token: string): Observable<Merchant[]> {
    if(token) {
      const url: string = this.apiVersion + ApiEndPoints.MERCHANT_LIST;

      return this.httpClient.get<Merchant[]>(url, this.getHttpOptions(token))
        .pipe(
          map(res => { return <Merchant[]>res; }),
          catchError(this.handleError)
        );
    }
    return throwError('<< HttpWrapper >> getMerchantList failed, token null');
  }

  // todo xl not complete
  public createNewAccount(email: string, password: string): Observable<{}> {
    console.warn('todo create account not yet complete');
    // todo xl make endpoint call to crate account
    return of(null);
  }

  // create merchant products
}
