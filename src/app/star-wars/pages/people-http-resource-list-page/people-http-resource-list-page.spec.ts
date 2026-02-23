import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleHttpResourceListPage } from './people-http-resource-list-page';

describe('PeopleHttpResourceListPage', () => {
  let component: PeopleHttpResourceListPage;
  let fixture: ComponentFixture<PeopleHttpResourceListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleHttpResourceListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleHttpResourceListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
