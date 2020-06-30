import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {catchError, take, takeUntil, timeout} from "rxjs/operators";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {Observable, of, Subject, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import { FormControl } from '@angular/forms';
import {ResponseLogin} from "../../../apis/responses/response-login";

@Component({
  selector: 'app-user-login-view',
  templateUrl: './user-login-view.component.html',
  styleUrls: ['./user-login-view.component.scss']
})
export class UserLoginViewComponent implements OnInit, OnDestroy {

  // custom
  public isLoginFailed: boolean;

  public emailInput = new FormControl('');
  public passwordInput = new FormControl('');

  private email: string;
  private password: string;

  // for unsubscribing to subscriptions on destroy
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  constructor(private http: HttpWrapperService, private router: Router, private activatedRoute: ActivatedRoute) {
    // go to merchant list if token is already fulfilled
    if(this.http.getAuthToken()) {
      this.router.navigate(['merchant/list']);
    }
  }

  ngOnInit(): void {

    // every change will update the values
    this.emailInput.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.email = val;
    });

    this.passwordInput.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.password = val;
    });
  }

  ngOnDestroy(): void {
    // unsub from all subscriptions to prevent memory leaks
    this._unSub.next(true);
    this._unSub.complete();
  }

  public logout(): void {
    this.http.clearAuthToken();
  }

  /**
   * Takes care of logging in and handling errors.
   */
  public login(): void {

    const timeoutTime: number = 7000;

    this.http.login(this.email, this.password)
      .pipe(
        take(1),
        timeout(timeoutTime)
      )
      .subscribe( (response: ResponseLogin) => {
          if(response && response.auth_token) {

            // set the token
            this.http.setAuthToken(response.auth_token);

            // take user to merchant list view
            this.router.navigate([ViewRoutes.MERCHANT_LIST]);
          } else {
            console.error('<< UserLoginView >> login failed, data returned is null');
            this.isLoginFailed = true;
          }
        },
        (e) => {
          this.isLoginFailed = true;
          console.error(e)
        }
      );

  }

}
