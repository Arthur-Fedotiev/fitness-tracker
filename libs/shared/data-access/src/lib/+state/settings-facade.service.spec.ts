import { TestBed } from '@angular/core/testing';

import { SettingsFacadeService } from './settings-facade.service';

describe('SettingsFacadeService', () => {
  let service: SettingsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
