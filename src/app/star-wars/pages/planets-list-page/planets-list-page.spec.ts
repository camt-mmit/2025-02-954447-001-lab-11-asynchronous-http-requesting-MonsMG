import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsListPage } from './planets-list-page';

describe('PlanetsListPage', () => {
  let component: PlanetsListPage;
  let fixture: ComponentFixture<PlanetsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetsListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
