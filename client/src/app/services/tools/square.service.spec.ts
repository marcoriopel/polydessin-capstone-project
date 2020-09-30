import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from './square.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
fdescribe('SquareService', () => {
    let service: SquareService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const drawSquareSpy = jasmine.createSpy;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let previewCanvasStub: HTMLCanvasElement;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvasStub = canvasTestHelper.canvas as HTMLCanvasElement;
        TestBed.configureTestingModule({
            providers: [{ SquareService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(SquareService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].previewCanvas = previewCanvasStub;

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

    it('should change the fillStyle', () => {
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
        service.onKeyUp(event);
        expect(service.isShiftKeyDown).toBe(false);
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
        expect(drawSquareSpy).toHaveBeenCalled();
    });

    it('should draw rectangle ', () => {
        service.firstPoint = { x: 20, y: 20 };
        service.lastPoint = { x: 40, y: 40 };
        const rectanglService = 'drawingService';
        const drawRectSpy = spyOn<any>(service, 'drawRectangle');
        const topLeftPointSpy = spyOn<any>(service, 'findTopLeftPoint');
        expect(topLeftPointSpy).toHaveBeenCalled();
        topLeftPointSpy(service.rectangleWidth, service.rectangleHeight);
        service[rectanglService].baseCtx = baseCtxStub;
        service[rectanglService].previewCtx = previewCtxStub;
        service.fillStyle = FILL_STYLES.BORDER;
        previewCtxStub.rect(service.firstPoint.x, service.firstPoint.y, service.rectangleWidth, service.rectangleHeight);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawServiceSpy.previewCanvas.style.cursor = 'none';
        service.handleCursor();
        expect(previewCanvasStub.style.cursor).toEqual('crosshair');
    });

    it('should get number from calculation of rectangleWidth', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 29, y: 29 };
        expect(service.rectangleWidth).toEqual(1);
    });

    it('should get number from calculation of rectangleHeight', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 25, y: 25 };
        expect(service.rectangleHeight).toEqual(service.firstPoint.y - service.lastPoint.x);
    });

    it('should create topLeftPoint', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 20, y: 20 };
        // let x = service.firstPoint.x;
        // let y = service.firstPoint.y;
        service.onMouseMove(mouseEvent);
    });
});
