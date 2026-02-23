import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmView } from './film-view';

describe('FilmView', () => {
  let component: FilmView;
  let fixture: ComponentFixture<FilmView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
