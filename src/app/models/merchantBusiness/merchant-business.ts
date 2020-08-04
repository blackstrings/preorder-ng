import { Merchant } from '../merchant/merchant';


export class MerchantBusiness {

    public merchant: Merchant;
    public businessName: string;
    public businessType: string;
    public description: string;

    public businessTax: string;
    public merchantCategory: number;

    public last4ssn: number;

    public businessEmail: string;
    public businessPhone: string;
    /** leave constructor empty */
    constructor() {}


}