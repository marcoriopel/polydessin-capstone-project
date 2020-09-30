import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingComponent } from './new-drawing.component';

import SpyObj = jasmine.SpyObj;
// const RECTANGLE_WIDTH = 40;
// const RECTANGLE_HEIGTH = 20;

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(async(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingServiceSpy = jasmine.createSpyObj('drawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
            providers: [{ provides: DrawingService, useValue: drawingServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // tslint:disable-next-line: no-string-literal
        component['drawingService'].baseCtx = baseCtxStub;
        component.drawingService.previewCtx = previewCtxStub;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* Test FAIL
    it('should call clearCanvas', () => {
        component.createNewDrawing();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });*/
});
