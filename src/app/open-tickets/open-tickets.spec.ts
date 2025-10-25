import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTickets } from './open-tickets';

describe('OpenTickets', () => {
  let component: OpenTickets;
  let fixture: ComponentFixture<OpenTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenTickets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenTickets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
