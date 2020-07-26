import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-merchant-how-it-works-view',
  templateUrl: './merchant-how-it-works-view.component.html',
  styleUrls: ['./merchant-how-it-works-view.component.scss']
})
export class MerchantHowItWorksViewComponent implements OnInit {

  constructor() {
    console.debug('<< MerchantHowItWorksView >> Init');
  }

  ngOnInit(): void {
  }

}
