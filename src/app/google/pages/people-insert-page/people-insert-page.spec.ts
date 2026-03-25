import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleInsertPage } from './people-insert-page';

describe('PeopleInsertPage', () => {
  let component: PeopleInsertPage;
  let fixture: ComponentFixture<PeopleInsertPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleInsertPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleInsertPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
