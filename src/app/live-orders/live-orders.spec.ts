import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrders } from './live-orders';

describe('LiveOrders', () => {
  let component: LiveOrders;
  let fixture: ComponentFixture<LiveOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
