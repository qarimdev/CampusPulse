import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavHeader } from './nav-header';

describe('NavHeader', () => {
  let component: NavHeader;
  let fixture: ComponentFixture<NavHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(NavHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
