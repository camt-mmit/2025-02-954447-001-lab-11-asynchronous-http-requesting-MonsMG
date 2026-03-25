import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleFieldTree } from './people-field-tree';

describe('PeopleFieldTree', () => {
  let component: PeopleFieldTree;
  let fixture: ComponentFixture<PeopleFieldTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleFieldTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleFieldTree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
