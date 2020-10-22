import { TestBed } from '@angular/core/testing';

import { StatementsService } from './statements.service';

describe('StatementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatementsService = TestBed.get(StatementsService);
    expect(service).toBeTruthy();
  });
});
