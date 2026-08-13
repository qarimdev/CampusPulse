import { TestBed } from '@angular/core/testing';

import { Announcement } from './announcement';

describe('Announcement', () => {
  let service: Announcement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Announcement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
