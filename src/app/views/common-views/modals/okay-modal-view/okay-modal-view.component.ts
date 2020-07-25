import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-okay-modal-view',
  templateUrl: './okay-modal-view.component.html',
  styleUrls: ['./okay-modal-view.component.scss']
})
export class OkayModalViewComponent implements OnInit {

  private _onClose: Subject<boolean> = new Subject<boolean>();
  public onClose: Observable<boolean> = this._onClose.asObservable();

  public header: string;
  public body: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  public init(header: string, body: string): void {
    this.header = header;
    this.body = body;
  }

  ngOnInit(): void {
  }

  /** publish the result then dismiss - order matters*/
  public okay(): void {
    this.activeModal.close();
    this._onClose.next(true);
  }

}
