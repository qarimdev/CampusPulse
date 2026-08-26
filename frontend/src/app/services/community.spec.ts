import { TestBed } from '@angular/core/testing';

import { Community } from './community';

describe('Community', () => {
  let service: Community;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Community);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
