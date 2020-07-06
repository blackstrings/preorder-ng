import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewRoutes} from "../../view-routes";
import {Observable, Subject} from "rxjs";
import {FormControl, FormGroup} from '@angular/forms';
import {ResponseLogin} from "../../../apis/responses/response-login";
import {take, takeUntil, timeout} from 'rxjs/operators';
import {UserService} from "../../../apis/services/user-service/user.service";

@Component({
  selector: 'app-user-login-view',
  templateUrl: './user-login-view.component.html',
  styleUrls: ['./user-login-view.component.scss']
})
export class UserLoginViewComponent implements OnInit, AfterViewInit, OnDestroy {

  // reference so we can use inside html
  ViewRoutes = ViewRoutes;

  // custom
  public isLoginFailed: boolean;

  public emailInput = new FormControl('');
  public passwordInput = new FormControl('');

  private email: string;
  private password: string;

  // for unsubscribing to subscriptions on destroy
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  public form1: FormGroup;

  constructor(private userService: UserService, private http: HttpWrapperService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    //this.forma = fb.group({})
    this.form1 = new FormGroup({});

    // go to merchant list if user is logged in
    if(this.userService.getAuthToken() && this.userService.isLoginValid()) {
      console.log('<< UserLoginView >> User is signed in, routing to merchant list');
      this.router.navigate([ViewRoutes.MERCHANT_LIST]);
    }
  }

  ngAfterViewInit(): void {
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

  /**
   * Takes care of logging in and handling errors.
   */
  public login(): void {

    if(this.email && this.password) {

      this.http.login(this.email, this.password)
        .pipe(
          take(1),
          timeout(7000)
        )
        .subscribe( (response: ResponseLogin) => {
            if(response && response.auth_token) {
              this.userService.setAuthToken(response.auth_token);
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

    } else {
      console.warn('<< UserLoginView >> login failed, email or passs null');
    }

  }

}
