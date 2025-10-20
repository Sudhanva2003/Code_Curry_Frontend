import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Delivery } from './delivery';

describe('Delivery', () => {
  let component: Delivery;
  let fixture: ComponentFixture<Delivery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Delivery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Delivery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
