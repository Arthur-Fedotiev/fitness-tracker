import { TestBed } from '@angular/core/testing';

import { WorkoutFacadeService } from './workout-facade.service';

describe('WorkoutFacadeService', () => {
  let service: WorkoutFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
