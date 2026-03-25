import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleListPage } from './people-list-page';

describe('PeopleListPage', () => {
  let component: PeopleListPage;
  let fixture: ComponentFixture<PeopleListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
