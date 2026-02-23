import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsList } from './films-list';

describe('FilmsList', () => {
  let component: FilmsList;
  let fixture: ComponentFixture<FilmsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
