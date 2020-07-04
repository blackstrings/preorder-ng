import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, of, ReplaySubject, throwError} from "rxjs";
import {ApiEndPoints} from "../api-end-points";
import {catchError, map} from "rxjs/operators";
import {Product} from "../objects/product";
import {Merchant} from "../objects/merchant/merchant";

/**
 * The front end service to make any backend calls.
 * Holds all the api calls to backend services.
 * Should the end points grow large, create sub services.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {

  // save user token once they login successfully
  private authToken: string;

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
  constructor(private httpClient: HttpClient) {
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
  public getAuthToken(): string {
    return this.authToken;
  }

  private getHttpOptions(): {params: HttpParams, headers: HttpHeaders} {
    if(this.authToken) {
      const headers: HttpHeaders = this.getUserAuthHeader();
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
  private getUserAuthHeader(): HttpHeaders {
    if(this.authToken) {
      const authHeader = new HttpHeaders({'Authorization': this.authToken});  //works
      // authHeader.append('Authorization', this.getAuthToken()); // doesn't seem to work after in init
      return authHeader;
    }
    throw new Error('<< HttpWrapper >> getUserAuthHeader failed, token null');
  }

  public setAuthToken(token: string): void {
    if(token){
      this.authToken = token;
      this._onLogin.next(true);
    }
  }

  public clearAuthToken(): void {
    this.authToken = null;
    this._onLogin.next(false);
  }

  public login(email: string, pass: string): Observable<{}> {
    // turn on for quick testing
    // console.warn('<< HttpWrapper >> email and pass is hardcoded for test user');
    // email = 'email@email.com';
    // pass = 'password';

    this.body = {'email': email, 'password': pass};
    const url: string = this.apiVersion + ApiEndPoints.USER_LOGIN;
    return this.httpClient.post(url, this.body, {params: this.params, headers: this.postHeadersJSON})
      .pipe(catchError(this.handleError));
  }

  public logout(): Observable<{}> {
    console.warn('todo logout from backend not fully wired yet');
    if(this.authToken){
      return this.httpClient.post(ApiEndPoints.USER_LOGOUT, null)
        .pipe(catchError(this.handleError));
    } else {
      console.warn('<< HttpWrapper >> logout unnecessary, token null');
    }
    return throwError('<< HttpWrapper >> Logout unnecessary, token is null');
  }

  /**
   * call to get merchant products
   * @api api/version/merchants/merchant_id/products/
   * */
  public getMerchantProducts(merchantID: number): Observable<Product[]> {
    if(merchantID && this.authToken) {
      const url: string = this.apiVersion + ApiEndPoints.MERCHANT
        + '/' + merchantID + '/' + ApiEndPoints.MERCHANT_PRODUCTS;

      return this.httpClient.get<Product[]>(url, this.getHttpOptions())
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
  public getMerchantList(): Observable<Merchant[]> {
    if(this.authToken) {
      const url: string = this.apiVersion + ApiEndPoints.MERCHANT_LIST;

      return this.httpClient.get<Merchant[]>(url, this.getHttpOptions())
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
    if(!this.authToken) {
      // todo xl make endpoint call to crate account
      return of(null);
    } else {
      console.error('<< HttpWrapper >> Failed to create account, token is not null as user is signed in');
    }
  }

  // create merchant products
}
