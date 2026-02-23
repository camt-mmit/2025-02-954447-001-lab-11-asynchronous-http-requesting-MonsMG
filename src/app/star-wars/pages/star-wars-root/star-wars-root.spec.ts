import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarWarsRoot } from './star-wars-root';

describe('StarWarsRoot', () => {
  let component: StarWarsRoot;
  let fixture: ComponentFixture<StarWarsRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarWarsRoot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarWarsRoot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
