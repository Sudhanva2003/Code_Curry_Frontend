import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCustomer } from './register-customer';

describe('RegisterCustomer', () => {
  let component: RegisterCustomer;
  let fixture: ComponentFixture<RegisterCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterCustomer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
