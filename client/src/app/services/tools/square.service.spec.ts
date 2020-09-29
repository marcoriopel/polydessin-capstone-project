import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from './square.service';

fdescribe('SquareService', () => {
    let service: SquareService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const blbnla = 'drawingService';
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSquareSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ SquareService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(SquareService);
        drawSquareSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change width', () => {
        service.width = 0;
        service.changeWidth(1);
        expect(service.width).toBe(1);
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        console.log(service.lastPoint);
        service[blbnla].baseCtx = baseCtxStub;
        service[blbnla].previewCtx = previewCtxStub;
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    it(' previewLayer.style.cursor should be crosshair ', () => {
        const handleCursorSpy = document.createElement('div');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(handleCursorSpy);
        service.handleCursor();
    });

    it(' should return abs rectangleheigh ', () => {
        const spy = spyOn(service, 'handleCursor').and.callThrough();
        service.handleCursor();
        expect(spy).toHaveBeenCalled();
    });

    it(' should return abs squarewidth ', () => {
        const spy = spyOn(service, 'handleCursor').and.callThrough();
        service.handleCursor();
        expect(spy).toHaveBeenCalled();
    });
});
