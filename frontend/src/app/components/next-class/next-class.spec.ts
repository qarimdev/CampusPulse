import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextClass } from './next-class';

describe('NextClass', () => {
  let component: NextClass;
  let fixture: ComponentFixture<NextClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextClass],
    }).compileComponents();

    fixture = TestBed.createComponent(NextClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
