import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetViewPage } from './planet-view-page';

describe('PlanetViewPage', () => {
  let component: PlanetViewPage;
  let fixture: ComponentFixture<PlanetViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
