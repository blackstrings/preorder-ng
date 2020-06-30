import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateAccountView } from './user-create-account-view.component';

describe('CreateUserAccountComponent', () => {
  let component: UserCreateAccountView;
  let fixture: ComponentFixture<UserCreateAccountView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreateAccountView ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateAccountView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
