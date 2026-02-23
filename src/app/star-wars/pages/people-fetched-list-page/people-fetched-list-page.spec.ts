import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleFetchedListPage } from './people-fetched-list-page';

describe('PeopleFetchedListPage', () => {
  let component: PeopleFetchedListPage;
  let fixture: ComponentFixture<PeopleFetchedListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleFetchedListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleFetchedListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
