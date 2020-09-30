import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from './circle.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
fdescribe('CircleService', () => {
    let service: CircleService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const drawCircleSPyy = jasmine.createSpy;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let previewCanvasStub: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvasStub = canvasTestHelper.canvas as HTMLCanvasElement;

        TestBed.configureTestingModule({
            providers: [{ CircleService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(CircleService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change line width', () => {
        service.width = 0;
        service.changeWidth(1);
        expect(service.width).toBe(1);
    });

    it('should change line width', () => {
        service.fillStyle = 1;
        service.changeFillStyle(1);
        expect(service.fillStyle).toBe(1);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('isShiftKeyDown should be true when shift key is pressed down', () => {
        const event = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        service.onKeyDown(event);
        expect(service.isShiftKeyDown).toBe(true);
    });

    it('isShiftKeyDown should be false when shift key is released', () => {
        const event = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        // const drawShapeSpy = spyOn<any>(service, 'drawShape');
        const rectanglService = 'drawingService';
        service.onKeyUp(event);
        service[rectanglService].baseCtx = baseCtxStub;
        service[rectanglService].previewCtx = previewCtxStub;
        expect(service.isShiftKeyDown).toBe(false);
        expect(drawCircleSPyy).toHaveBeenCalled();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' onMouseUp should call drawShape if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        const rectanglService = 'drawingService';
        const topLeftPointSpy = spyOn<any>(service, 'findTopLeftPoint');
        service[rectanglService].baseCtx = baseCtxStub;
        service[rectanglService].previewCtx = previewCtxStub;
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(topLeftPointSpy).toHaveBeenCalled();
        expect(drawCircleSPyy).toHaveBeenCalled();
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawServiceSpy.previewCanvas.style.cursor = 'none';
        service.handleCursor();
        expect(previewCanvasStub.style.cursor).toEqual('crosshair');
    });

    it('should get number from calculation of circleWidth', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 29, y: 29 };
        expect(service.circleWidth).toEqual(1);
    });

    it('should get number from calculation of circleHeight', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 25, y: 25 };
        expect(service.circleHeight).toEqual(service.firstPoint.y - service.lastPoint.x);
    });

    it('should create topLeftPoint', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 20, y: 20 };
    });
});
