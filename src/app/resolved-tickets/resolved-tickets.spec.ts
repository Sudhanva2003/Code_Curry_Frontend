import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolvedTickets } from './resolved-tickets';

describe('ResolvedTickets', () => {
  let component: ResolvedTickets;
  let fixture: ComponentFixture<ResolvedTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResolvedTickets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolvedTickets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
