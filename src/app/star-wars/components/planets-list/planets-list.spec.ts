import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsList } from './planets-list';

describe('PlanetsList', () => {
  let component: PlanetsList;
  let fixture: ComponentFixture<PlanetsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
