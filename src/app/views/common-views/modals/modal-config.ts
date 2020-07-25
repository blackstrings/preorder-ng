import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

export class ModalConfig {

  public static getClickOnlyScrollable(): NgbModalOptions {
    return {backdrop: 'static', keyboard: false, scrollable: true};
  }

  public static getCloseByAnyKeyScrollable(): NgbModalOptions {
    return {keyboard: true, scrollable: true};
  }

  public static getClickOnly(): NgbModalOptions {
    return {backdrop: 'static', keyboard: false, scrollable: false};
  }
}
