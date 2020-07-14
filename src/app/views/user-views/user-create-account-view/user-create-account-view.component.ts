import { User } from './../../../models/user/user';
import {Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {takeUntil, catchError, take} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';
import {ViewRoutes} from '../../view-routes';
import {UserService} from '../../../services/user-service/user.service';
import { ResponseLogin } from '../../../apis/responses/response-login';
import { HttpErrorContainer } from '../../../apis/http-wrapper/http-error-container';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-create-account-view',
  templateUrl: './user-create-account-view.component.html',
  styleUrls: ['./user-create-account-view.component.scss']
})
export class UserCreateAccountView implements OnInit {

  ViewRoutes = ViewRoutes;

  public formCreate: FormGroup;

  public isEmailValid: boolean = false;
  public isPassValid: boolean = false;
  public user: User = new User();

  // custom
  public showCreateAccountFailed: boolean = false;
  public showServerError: boolean = false;

  // for unsubscribing to subscriptions on destroy
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  // form inputs wired to form control for live feedbacks
  public emailFC = new FormControl(
    this.user.email, [
      Validators.required, Validators.email
    ]);

  public passwordFC = new FormControl(
    this.user.password, [
      Validators.required, Validators.minLength(6)
    ]);

  public password2FC = new FormControl(
    this.user.password, [
      Validators.required, Validators.minLength(6)
    ]);

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // every change will update the values
    this.emailFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.user.email = val;
    });

    this.passwordFC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.user.password = val;
    });

    this.password2FC.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.user.password2 = val;
    });

    this.formCreate = new FormGroup({
      'email': this.emailFC,
      'password': this.passwordFC,
      'password2': this.password2FC
    });
  }

  public create(): void {

      if(this.isFormValid()) {
  
        // debug only for faster login test
        // this.user.email = 'email@email.com';
        // this.user.password = 'password';
  
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
                    this.showCreateAccountFailed = true;
                    this.showServerError = false;
                  } else {
                    this.showCreateAccountFailed = false;
                    this.showServerError = true;
                  }
                } else {
                  console.log('<< UserLoginView >> Login success');
                  this.router.navigate([ViewRoutes.MERCHANT_LIST]);
                  this.showCreateAccountFailed = !response.isLoginSuccess;
                }
  
              } else {
                console.error('<< UserLoginView >> login failed, data returned is null');
                this.showCreateAccountFailed = true;
              }
            },
            (e) => {
              console.error(e);
              this.showCreateAccountFailed = true;
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
