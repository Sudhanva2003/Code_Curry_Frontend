import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredOrders } from './delivered-orders';

describe('DeliveredOrders', () => {
  let component: DeliveredOrders;
  let fixture: ComponentFixture<DeliveredOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveredOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveredOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
