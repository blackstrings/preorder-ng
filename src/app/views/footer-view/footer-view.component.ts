import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-view',
  templateUrl: './footer-view.component.html',
  styleUrls: ['./footer-view.component.scss']
})
export class FooterViewComponent implements OnInit {

  public currentYear: number;
  constructor() {

  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

}
