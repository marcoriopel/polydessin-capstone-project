import { TestBed } from '@angular/core/testing';

import { NouveauDessinService } from './nouveau-dessin.service';

describe('NouveauDessinService', () => {
  let service: NouveauDessinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NouveauDessinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
