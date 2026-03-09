import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleRoot } from './google-root';

describe('GoogleRoot', () => {
  let component: GoogleRoot;
  let fixture: ComponentFixture<GoogleRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleRoot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleRoot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
