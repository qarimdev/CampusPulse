import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementsDrawer } from './announcements-drawer';

describe('AnnouncementsDrawer', () => {
  let component: AnnouncementsDrawer;
  let fixture: ComponentFixture<AnnouncementsDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
