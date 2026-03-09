import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInsertPage } from './event-insert-page';

describe('EventInsertPage', () => {
  let component: EventInsertPage;
  let fixture: ComponentFixture<EventInsertPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInsertPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInsertPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
