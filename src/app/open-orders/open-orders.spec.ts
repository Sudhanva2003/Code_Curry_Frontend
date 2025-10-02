import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrders } from './open-orders';

describe('OpenOrders', () => {
  let component: OpenOrders;
  let fixture: ComponentFixture<OpenOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
