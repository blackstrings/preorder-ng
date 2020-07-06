import { Component, OnInit } from '@angular/core';
import {User} from "../../../models/user/user";

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss']
})
export class UserProfileViewComponent implements OnInit {

  public user: User;
  constructor() { }

  ngOnInit(): void {
    // todo test
    console.warn('<< UserProfileView >> todo not complete');
    this.user = new User();
    this.user.firstName = 'tom';
    this.user.lastName = 'mcHon';
    this.user.id = 1;
    this.user.points = 99;
  }

}
