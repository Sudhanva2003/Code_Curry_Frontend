import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSettings } from './customer-settings';

describe('CustomerSettings', () => {
  let component: CustomerSettings;
  let fixture: ComponentFixture<CustomerSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
