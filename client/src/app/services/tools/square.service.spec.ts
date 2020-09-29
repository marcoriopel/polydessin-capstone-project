import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from './square.service';

describe('SquareService', () => {
    let service: SquareService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ SquareService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(SquareService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
