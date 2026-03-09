import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListPage } from './events-list-page';

describe('EventsListPage', () => {
  let component: EventsListPage;
  let fixture: ComponentFixture<EventsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
