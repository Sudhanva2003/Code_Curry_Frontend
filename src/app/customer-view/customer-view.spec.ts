import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerView } from './customer-view';

describe('CustomerView', () => {
  let component: CustomerView;
  let fixture: ComponentFixture<CustomerView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
