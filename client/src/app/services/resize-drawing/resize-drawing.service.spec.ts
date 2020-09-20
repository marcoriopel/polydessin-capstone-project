import { TestBed } from '@angular/core/testing';

import { ResizeDrawingService } from './resize-drawing.service';

describe('ResizeDrawingService', () => {
  let service: ResizeDrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResizeDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
