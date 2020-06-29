import { Component, OnInit } from '@angular/core';
import {Merchant} from "../../../apis/objects/merchant";
import {HttpWrapperService} from "../../../apis/http-wrapper/http-wrapper.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-merhchant-list-view',
  templateUrl: './merchant-list-view.component.html',
  styleUrls: ['./merchant-list-view.component.scss']
})
export class MerchantListViewComponent implements OnInit {

  public merchants: Merchant[] = [];

  constructor(private http: HttpWrapperService) {
  }

  ngOnInit(): void {
    this.http.getMerchantList().pipe(take(1)).subscribe((data: Merchant[]) => {
      console.log(data);
      // todo sample only
      this.merchants = data;
    }, (e) => {
      console.error('<< MerchantListView >> retrieving merchante lists failed');
      console.error(e);
    });
  }

}
