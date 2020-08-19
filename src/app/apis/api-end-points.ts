/**
 * serves as a single place to access all the api end points
 * Holds all the api uris for the entire app
 * Final api calls are usually 'domain.com/api/v1/user/login'
 */
export class ApiEndPoints {

  // the version to concat to all api calls
  public static readonly VERSION1: string = 'api/v1/';
  public static readonly VERSION2: string = 'api/v2/';
  public static readonly TARGET_VERSION: string = ApiEndPoints.VERSION1;

  public static readonly USER_CREATE: string = 'registrations';
  public static readonly USER_LOGIN: string = 'authenticate';
  public static readonly USER_LOGOUT: string = 'user/logout';
  public static readonly USER_SUBMIT_ORDER: string = 'order_items';
  public static readonly USER_ORDER: string = 'orders';
  public static readonly USER_PRE_VALIDATE_ORDER: string = 'ordervalidate';
  public static readonly MERCHANT: string = 'merchants';
  public static readonly MERCHANT_CREATE: string = 'merchants';
  public static readonly MERCHANT_LIST: string = 'merchants';
  public static readonly MERCHANT_LIST_BY_USER: string = 'get_all_merchants_for_user';
  public static readonly MERCHANT_ADD_PRODUCT: string = 'products';
  public static readonly MERCHANT_GET_ID: string = 'TODO';

  // get,
  public static readonly MERCHANT_PRODUCTS: string = 'products';
}
