import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {ViewRoutes} from "../../view-routes";
import {UserService} from "../../../services/user-service/user.service";

@Component({
  selector: 'app-user-create-account-view',
  templateUrl: './user-create-account-view.component.html',
  styleUrls: ['./user-create-account-view.component.scss']
})
export class UserCreateAccountView implements OnInit {

  ViewRoutes = ViewRoutes;

  public isEmailValid: boolean = false;
  public isPassValid: boolean = false;

  public emailInput = new FormControl('');
  public passwordInput1 = new FormControl('');
  public passwordInput2 = new FormControl('');

  // for unsubscribing to subscriptions on destroy
  private _unSub: Subject<boolean> = new Subject();  // subjects vs replay won't replay when reinitialize
  private unSub: Observable<boolean> = this._unSub.asObservable();

  private email: string;
  private password1: string;
  private password2: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // every change will update the values
    this.emailInput.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.email = val;
    });

    this.passwordInput1.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.password1 = val;
    });

    this.passwordInput1.valueChanges.pipe(takeUntil(this.unSub)).subscribe((val: string) => {
      this.password2 = val;
    });
  }

  public createNewAccount(): void {
    if(this.password1 === this.password2) {
      console.error('createAccount() not implmemented');
      this.userService.createAccount();
      //this.userService.createNewAccount(this.email, this.password1);
    }
  }

}
