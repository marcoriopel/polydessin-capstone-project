import { TestBed } from '@angular/core/testing';

import { OpenWindowsService } from './open-windows.service';

describe('OpenWindowsService', () => {
  let service: OpenWindowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenWindowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
