import { TestBed } from '@angular/core/testing';

import { PolygoneServiceService } from './polygone-service.service';

describe('PolygoneServiceService', () => {
  let service: PolygoneServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygoneServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
