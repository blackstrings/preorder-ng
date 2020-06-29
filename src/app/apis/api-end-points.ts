/**
 * serves as a single place to access all the api end points
 * Holds all the api uris for the entire app
 * Final api calls are uslaly 'domain.com/api/v1/user/login'
 */
export class ApiEndPoints {

  // the version to concat to all api calls
  public static readonly VERSION1: string = 'api/v1/';
  public static readonly TARGET_VERSION: string = ApiEndPoints.VERSION1;

  public static readonly USER_LOGIN: string = 'authenticate';
  public static readonly USER_LOGOUT: string = 'user/logout';
  public static readonly MERCHANT_CREATE: string = 'merchant/create';
  public static readonly MERCHANT_LIST: string = 'merchants';
}
