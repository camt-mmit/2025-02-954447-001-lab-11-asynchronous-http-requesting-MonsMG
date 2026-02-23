import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmViewPage } from './film-view-page';

describe('FilmViewPage', () => {
  let component: FilmViewPage;
  let fixture: ComponentFixture<FilmViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
