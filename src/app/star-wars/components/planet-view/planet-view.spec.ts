import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetView } from './planet-view';

describe('PlanetView', () => {
  let component: PlanetView;
  let fixture: ComponentFixture<PlanetView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
