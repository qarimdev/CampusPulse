import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDiscussion } from './community-discussion';

describe('CommunityDiscussion', () => {
  let component: CommunityDiscussion;
  let fixture: ComponentFixture<CommunityDiscussion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityDiscussion],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityDiscussion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
