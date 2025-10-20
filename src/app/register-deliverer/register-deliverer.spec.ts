import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDeliverer } from './register-deliverer';

describe('RegisterDeliverer', () => {
  let component: RegisterDeliverer;
  let fixture: ComponentFixture<RegisterDeliverer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterDeliverer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDeliverer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
