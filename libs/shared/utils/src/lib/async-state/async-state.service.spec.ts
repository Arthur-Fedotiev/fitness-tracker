import { TestBed } from '@angular/core/testing';

import { AsyncStateService } from './async-state.service';

describe('AsyncStateService', () => {
  let service: AsyncStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsyncStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
