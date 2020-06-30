import { Component, OnInit } from '@angular/core';
import {User} from "../../../apis/objects/user";

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
    this.user = new User('Tom', 'Kernally', 1, 220);
  }

}
