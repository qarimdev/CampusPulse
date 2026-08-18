import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePlanner } from './course-planner';

describe('CoursePlanner', () => {
  let component: CoursePlanner;
  let fixture: ComponentFixture<CoursePlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePlanner],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
