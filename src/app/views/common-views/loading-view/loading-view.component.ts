import {Component, Input, OnInit} from '@angular/core';

/** used for loading screens on every page */
@Component({
  selector: 'app-loading-view',
  templateUrl: './loading-view.component.html',
  styleUrls: ['./loading-view.component.scss']
})
export class LoadingViewComponent implements OnInit {

  @Input()
  public isScreenInitError: boolean = false;

  @Input()
  public isScreenLoading: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
