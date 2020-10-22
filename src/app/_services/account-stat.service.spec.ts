import { TestBed } from '@angular/core/testing';

import { AccountStatService } from './account-stat.service';

describe('AccountStatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountStatService = TestBed.get(AccountStatService);
    expect(service).toBeTruthy();
  });
});
