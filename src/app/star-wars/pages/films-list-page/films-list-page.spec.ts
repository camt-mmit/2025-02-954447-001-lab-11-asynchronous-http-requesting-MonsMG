import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsListPage } from './films-list-page';

describe('FilmsListPage', () => {
  let component: FilmsListPage;
  let fixture: ComponentFixture<FilmsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
