import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantMenu } from './restaurant-menu';

describe('RestaurantMenu', () => {
  let component: RestaurantMenu;
  let fixture: ComponentFixture<RestaurantMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
