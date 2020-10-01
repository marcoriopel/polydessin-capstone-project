import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from './new-drawing.service';

import SpyObj = jasmine.SpyObj;
const RECTANGLE_WIDTH = 40;
const RECTANGLE_HEIGTH = 20;

describe('NewDrawingService', () => {
    let service: NewDrawingService;
    let matDialogSpy: SpyObj<MatDialog>;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(async(() => {
        matDialogSpy = jasmine.createSpyObj('dialog', ['open']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['isCanvasBlank']);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });
    }));

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NewDrawingService);
        service.drawingService.baseCtx = baseCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should open a warning if canvas is not blank', () => {
        baseCtxStub.fillRect(0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGTH);
        service.openWarning();
        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(drawingServiceSpy.isCanvasBlank).toHaveBeenCalled();
    });
});
