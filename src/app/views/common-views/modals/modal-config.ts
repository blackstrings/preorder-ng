import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

export class ModalConfig {

  /** click required to close modal and scrollable */
  public static requiresClickAndScrollable(): NgbModalOptions {
    return {backdrop: 'static', keyboard: false, scrollable: true};
  }

  public static requiresClickAndNotScrollable(): NgbModalOptions {
    return {backdrop: 'static', keyboard: false, scrollable: false};
  }

  public static anyKeyToCloseAndScrollable(): NgbModalOptions {
    return {keyboard: true, scrollable: true};
  }

  public static anyKeyToCloseAndNotScrollable(): NgbModalOptions {
    return {keyboard: true, scrollable: false};
  }

}
