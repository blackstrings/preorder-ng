import {Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Order} from "../../../models/order/order";
import {UserService} from "../../../services/user-service/user.service";
import {CartService} from "../../../services/cart-service/cart.service";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {HttpErrorContainer} from "../../../apis/http-wrapper/http-error-container";

/** displays an order that has been paid for. Possible turned into a modal? */
@Component({
  selector: 'app-order-purchase-view',
  templateUrl: './order-purchase-view.component.html',
  styleUrls: ['./order-purchase-view.component.scss']
})
export class OrderPurchaseViewComponent implements OnInit {

  public onOrderLoaded$: Observable<Order | HttpErrorContainer>;

  public isScreenInitError: boolean = false;
  public isScreenLoading: boolean = true;

  constructor(private userService: UserService, private cartService: CartService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(params => {
      const orderId: string = params.get('orderId');
      if(orderId) {
        this.loadOrder(orderId);
      } else {
        console.error('<< OrderPurchaseView >> init failed, orderId null');
        this.isScreenLoading = false;
        this.isScreenInitError = true;
      }
    });
  }

  /**
   * todo consider moving this to the order history and just have this component render the order data through input
   * load and display the order based on the orderID provided from the backend.
   * The payment token will be within the order.
   */
  private loadOrder(orderID: string): void {
    if(orderID) {
      const token: string = this.userService.getAuthToken();
      if(token) {

        // just store the returned observable so we can rely on it to render the data
        this.onOrderLoaded$ = this.cartService.getCheckedOutOrder(orderID, token);

        // then subscribe to it separately
        this.onOrderLoaded$
          .pipe(take(1))
          .subscribe( (resp: Order) => {
              if(resp instanceof Order) {
                console.log('<< OrderPurchaseView >> load complete and success');
              } else {
                console.error('<< OrderPurchaseView >> loadOrder failed, response not instanceof Order');
                this.isScreenInitError = true;
              }

              // loading complete
              this.isScreenLoading = false;

            },
            (e) => {
              console.error('<< OrderPurchaseView >> loadOrder failed, network error');
              console.error(e);
              this.isScreenInitError = true;
              this.isScreenLoading = false;
            });

      } else {
        console.error('<< OrderPurchaseView >> loadOrder failed, token null');
      }

    } else {
      console.error('<< OrderPurchaseView >> loadOrder failed, orderID null');
    }
  }

}
