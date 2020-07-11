import {HttpWrapperService} from "./http-wrapper.service";
import {Injectable} from "@angular/core";

/** do not extend or create constructor for mock services for best testing */
@Injectable()
export class HttpWrapperServiceTest {
  public post: jasmine.Spy = spyOn(HttpWrapperService.prototype, 'post');
  public get: jasmine.Spy = spyOn(HttpWrapperService.prototype, 'get');
}
