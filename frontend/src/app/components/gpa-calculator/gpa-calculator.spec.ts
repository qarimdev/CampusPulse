import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpaCalculator } from './gpa-calculator';

describe('GpaCalculator', () => {
  let component: GpaCalculator;
  let fixture: ComponentFixture<GpaCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpaCalculator],
    }).compileComponents();

    fixture = TestBed.createComponent(GpaCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
