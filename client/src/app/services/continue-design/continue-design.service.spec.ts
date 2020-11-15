import { TestBed } from '@angular/core/testing';

import { ContinueDesignService } from './continue-design.service';

describe('ContinueDesignService', () => {
    let service: ContinueDesignService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ContinueDesignService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
