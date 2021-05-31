import {Component, OnInit, VERSION} from '@angular/core';

@Component({
  selector: 'app-footer-view',
  templateUrl: './footer-view.component.html',
  styleUrls: ['./footer-view.component.scss']
})
export class FooterViewComponent implements OnInit {

  public ver: string = VERSION.major;
  public currentYear: number;
  constructor() {

  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

}
