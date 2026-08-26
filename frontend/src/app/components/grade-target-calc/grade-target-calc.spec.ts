import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeTargetCalc } from './grade-target-calc';

describe('GradeTargetCalc', () => {
  let component: GradeTargetCalc;
  let fixture: ComponentFixture<GradeTargetCalc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeTargetCalc],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeTargetCalc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
