import { TestBed } from '@angular/core/testing';
import { ColorSelectionService } from './color-selection.service';

describe('ColorSelectionService', () => {
    let service: ColorSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
