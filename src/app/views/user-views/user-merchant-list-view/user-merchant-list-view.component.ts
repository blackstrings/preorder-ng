import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import {Merchant} from "../../../models/merchant/merchant";
import {delay, take} from "rxjs/operators";
import {ViewRoutes} from "../../view-routes";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user-service/user.service";
import {MerchantService} from "../../../services/merchant-service/merchant.service";
import {FormGroup} from "@angular/forms";
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-user-merhchant-list-view',
  templateUrl: './user-merchant-list-view.component.html',
  styleUrls: ['./user-merchant-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMerchantListViewComponent implements AfterContentInit {

  ViewRoutes = ViewRoutes;

  public merchants: Merchant[] = [];
  public readonly maxCharLimit: number = 36;
  public formSearchType: FormGroup = new FormGroup({});

  private onLoadingComplete: Subject<boolean> = new Subject<boolean>();
  public onLoadingComplete$: Observable<boolean> = this.onLoadingComplete.asObservable();

  constructor(
    private router: Router,
    private userService: UserService,
    private merchantService: MerchantService
  ) {
    console.log('<< UserMerchantListView >> View Initiated');
  }

  /**
   * rather than ngAfterViewInit, this one is used to avoid error with content
   * change detection with the pipe async in the html
   */
  ngAfterContentInit() {
    this.populateMerchantList();
  }

  /**
   * todo user should provide zipcode or search by string name
   * currently just returning all list in the database
   */
  private populateMerchantList(): void {
    this.onLoadingComplete.next(false);
    const token: string = this.userService.getAuthToken();
    this.merchantService.getMerchantList(token)
      .pipe(delay(1000), take(1))
      .subscribe((data: Merchant[]) => {
        console.debug(data);
        this.merchants = data;
        // clone the data into the merchants from the IMerchant[] shape
        // if the object is a blob, you can try to push it into its shape with
        // this.merchants = {...data}
        // this.merchants = [...data]
        this.onLoadingComplete.next(true);
      }, (e) => {
        console.error(e);
        console.error('<< UserMerchantListView >> populateMerchantList failed');
        this.onLoadingComplete.next(true);
      });
  }

  public goToUserCreateOrderView(id: number): void {
    this.router.navigate(['/' + ViewRoutes.USER_CREATE_ORDER, id])
      .then((success: boolean) => {
        if(!success){
          console.warn('<< UserMerchantListView >> goToUserCreateOrderView failed');
        }
      });
  }

}
