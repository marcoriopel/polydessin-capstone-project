import { TestBed } from '@angular/core/testing';

import { SquareSelectionService } from './square-selection.service';

describe('SquareSelectionService', () => {
  let service: SquareSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquareSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
