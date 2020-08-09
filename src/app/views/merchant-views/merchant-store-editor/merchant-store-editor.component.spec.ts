import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantStoreEditorComponent } from './merchant-store-editor.component';

describe('MerchantStoreEditComponent', () => {
  let component: MerchantStoreEditorComponent;
  let fixture: ComponentFixture<MerchantStoreEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantStoreEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantStoreEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
