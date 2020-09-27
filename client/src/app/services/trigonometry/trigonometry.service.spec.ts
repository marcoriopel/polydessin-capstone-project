import { TestBed } from '@angular/core/testing';

import { TrigonometryService } from './trigonometry.service';

describe('TrigonometryService', () => {
    let service: TrigonometryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TrigonometryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
