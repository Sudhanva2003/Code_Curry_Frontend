import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRestaurant } from './register-restaurant';

describe('RegisterRestaurant', () => {
  let component: RegisterRestaurant;
  let fixture: ComponentFixture<RegisterRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRestaurant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
