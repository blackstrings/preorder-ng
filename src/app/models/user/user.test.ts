import {User} from "./user";

export class UserTest extends User {

  public static createGeneric(): UserTest {
    return UserTest.create(1);
  }

  public static create(id: number, fName: string = 'testFname',
                       lName: string = 'testLName', email: string = 'test@t.com'): UserTest {
    const m: UserTest = new UserTest();
    m.firstName = fName;
    m.lastName = lName;
    m.id = id;
    m.email = email;
    return m;
  }

}
