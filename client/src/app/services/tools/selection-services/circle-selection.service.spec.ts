import { TestBed } from '@angular/core/testing';

import { CircleSelectionService } from './circle-selection.service';

describe('CircleSelectionService', () => {
  let service: CircleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
