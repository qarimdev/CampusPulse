import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskChecklist } from './task-checklist';

describe('TaskChecklist', () => {
  let component: TaskChecklist;
  let fixture: ComponentFixture<TaskChecklist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskChecklist],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskChecklist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
