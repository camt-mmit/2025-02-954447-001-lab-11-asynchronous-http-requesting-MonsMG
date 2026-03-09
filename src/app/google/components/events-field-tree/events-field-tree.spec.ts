import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFieldTree } from './events-field-tree';

describe('EventsFieldTree', () => {
  let component: EventsFieldTree;
  let fixture: ComponentFixture<EventsFieldTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsFieldTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsFieldTree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
