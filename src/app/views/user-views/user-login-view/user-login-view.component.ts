import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {Observable, Subject, throwError} from "rxjs";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseLogin} from "../../../apis/responses/response-login";
import {catchError, take, takeUntil} from 'rxjs/operators';
import {UserService} from "../../../services/user-service/user.service";
import {User} from "../../../models/user/user";
import {HttpErrorContainer} from "../../../apis/http-wrapper/http-error-container";

@Component({
  selector: 'app-user-login-view',
  templateUrl: './user-login-view.component.html',
  styleUrls: ['./user-login-view.component.scss']
})
export class UserLoginViewComponent implements OnInit, AfterViewInit, OnDestroy {

  // reference so we can use inside html
  ViewRoutes = ViewRoutes;

  // custom
  public showLoginFailed: boolean = false;
  public showServerError: boolean = false;

  // the model
  public user: User = new User();

  // form inputs wired to form control for live feedbacks
  public emailFC = new FormControl(
    this.user.email, [
      Validators.required, Validators.email
    ]);

  public passwordFC = new FormControl(
    this.user.password, [
      Validators.required, Validators.minLength(4)
    ]);

  // for unsubscription when component is destroyed
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  public formLogin: FormGroup;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    console.log('<< UserLoginView >> View Initiated');

    // auto route to merchant list if user is logged in
    if(this.userService.getAuthToken()) {
      console.log('<< UserLoginView >> User is signed in, routing to merchant list');
      this.router.navigate([ViewRoutes.MERCHANT_LIST]);
    }
  }

  ngOnInit(): void {

    //this.forma = fb.group({})
    this.formLogin = new FormGroup({
      'email': this.emailFC,
      'password': this.passwordFC
    });

  }

  ngAfterViewInit(): void {
    // wire the form inputs so on every change it will update the values in the model
    this.emailFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.user.email = val;
    });

    this.passwordFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.user.password = val;
    });

  }

  ngOnDestroy(): void {
    // unsub from all subscriptions to prevent memory leaks
    this._unSub.next(true);
    this._unSub.complete();
  }

  /**
   * Takes care of logging in and handling errors.
   */
  public login(): void {

    if(this.isFormValid()) {

      this.userService.login(this.user.email, this.user.password)
        .pipe(
          take(1),
          catchError( e => throwError(e))
        )
        .subscribe( (response: ResponseLogin | HttpErrorContainer) => {
            if(response) {
              // handle server errors
              if(response instanceof HttpErrorContainer) {
                if(response.status === 401) {
                  this.showLoginFailed = true;
                  this.showServerError = false;
                } else {
                  this.showLoginFailed = false;
                  this.showServerError = true;
                }
              } else {
                console.log('<< UserLoginView >> Login success');
                this.router.navigate([ViewRoutes.MERCHANT_LIST]);
                this.showLoginFailed = !response.isLoginSuccess;
              }

            } else {
              console.error('<< UserLoginView >> login failed, data returned is null');
              this.showLoginFailed = true;
            }
          },
          (e) => {
            console.error(e);
            this.showLoginFailed = true;
          }
        );

    } else {
      console.warn('<< UserLoginView >> login failed, form is invalid');
    }

  }

  /** final form check before making call */
  private isFormValid(): boolean {
    let result: boolean = true;
    if(!this.user) {result = false; }
    if(result && !this.user.email) { result = false; }
    if(result && !this.user.password) { result = false; }
    return true;
  }

}
