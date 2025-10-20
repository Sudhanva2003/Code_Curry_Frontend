import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelivererView } from './deliverer-view';

describe('DelivererView', () => {
  let component: DelivererView;
  let fixture: ComponentFixture<DelivererView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelivererView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelivererView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
