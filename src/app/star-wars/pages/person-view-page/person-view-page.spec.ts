import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonViewPage } from './person-view-page';

describe('PersonViewPage', () => {
  let component: PersonViewPage;
  let fixture: ComponentFixture<PersonViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
