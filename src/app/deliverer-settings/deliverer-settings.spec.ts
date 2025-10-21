import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelivererSettings } from './deliverer-settings';

describe('DelivererSettings', () => {
  let component: DelivererSettings;
  let fixture: ComponentFixture<DelivererSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelivererSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelivererSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
