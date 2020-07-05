export class Merchant {

  constructor(private id: number, private name: string) {

  }

  public getName(): string {
    return this.name;
  }

  public getID(): number {
    return this.id;
  }

  /** turns serialized object into the concrete form */
  public static deserialize(data: Merchant): Merchant {
    return new Merchant(
      data.id,
      data.name
    );
  }

  /**
   * Deserialize an array of merchants objects to concrete if they are in json form
   * @param data assumed to be in JSON format
   */
  public static deserializeArray(data: Merchant[]): Merchant[] {
    if(data) {
      const merchants: Merchant[] = [];
      data.forEach(d => {
        merchants.push(Merchant.deserialize(d));
      });
      return merchants;
    }
  }

  /* todo xl remove when done implementing this class
  created_at: "2019-10-29T02:09:35-04:00"
description: "eggs and rolls"
id: 1
merchant_owner: {}
merchant_owner_id: 1
name: "eggrollplus"
products: (2) [{…}, {…}]
updated_at: "2019-10-29T02:09:35-04:00"
   */


}