import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTrigger } from './load-trigger';

describe('LoadTrigger', () => {
  let component: LoadTrigger;
  let fixture: ComponentFixture<LoadTrigger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadTrigger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadTrigger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
