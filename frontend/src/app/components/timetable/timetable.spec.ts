import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timetable } from './timetable';

describe('Timetable', () => {
  let component: Timetable;
  let fixture: ComponentFixture<Timetable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timetable],
    }).compileComponents();

    fixture = TestBed.createComponent(Timetable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
