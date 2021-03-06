import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

/** used for displaying a loading status screens on every page */
@Component({
  selector: 'app-loading-view',
  templateUrl: './loading-view.component.html',
  styleUrls: ['./loading-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingViewComponent implements OnInit {

  // allow you to inject params when loading this view
  @Input()
  public isScreenInitError: boolean = false;

  // allow you to inject params when loading this view
  @Input()
  public isScreenLoading: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
