import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from './square.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('SquareService', () => {
    let service: SquareService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawShapeSpy: jasmine.Spy<any>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let previewCanvasStub: HTMLCanvasElement;
    let setRectangleWidthSpy: jasmine.Spy<any>;
    let setRectangleHeigthSpy: jasmine.Spy<any>;
    let drawRectSpy: jasmine.Spy<any>;
    let topLeftPointSpy: jasmine.Spy<any>;
    let drawSquareSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;
    let colorPickerStub: ColorSelectionService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvasStub = canvasTestHelper.canvas as HTMLCanvasElement;
        colorPickerStub = new ColorSelectionService();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorSelectionService, useValue: colorPickerStub },
            ],
        });
        service = TestBed.inject(SquareService);
        drawShapeSpy = spyOn<any>(service, 'drawShape').and.callThrough();
        setRectangleWidthSpy = spyOn<any>(service, 'setRectangleWidth').and.callThrough();
        setRectangleHeigthSpy = spyOn<any>(service, 'setRectangleHeight').and.callThrough();
        topLeftPointSpy = spyOn<any>(service, 'findTopLeftPoint').and.callThrough();
        drawRectSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        drawSquareSpy = spyOn<any>(service, 'drawSquare').and.callThrough();
        ctxFillSpy = spyOn<any>(baseCtxStub, 'fillRect').and.callThrough();

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
        service.fillStyle = FILL_STYLES.FILL;
        service.changeFillStyle(FILL_STYLES.BORDER);
        expect(service.fillStyle).toBe(FILL_STYLES.BORDER);
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

    it(' onMouseUp should call drawShape if mouse was already down', () => {
        const mouseEventLClick = {
            offsetX: 0,
            offsetY: 0,
            button: MouseButton.Left,
        } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseUp(mouseEvent);
        expect(setRectangleHeigthSpy).toHaveBeenCalled();
        expect(setRectangleWidthSpy).toHaveBeenCalled();
        expect(topLeftPointSpy).toHaveBeenCalled();
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('should draw rectangle ', () => {
        const mouseEventLClick = {
            offsetX: 20,
            offsetY: 20,
            button: MouseButton.Left,
        } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseUp(mouseEvent);
        expect(drawRectSpy).toHaveBeenCalled();
        expect(topLeftPointSpy).toHaveBeenCalled();
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawServiceSpy.previewCanvas.style.cursor = 'none';
        service.handleCursor();
        expect(previewCanvasStub.style.cursor).toEqual('crosshair');
    });

    it('should get number from calculation of rectangleWidth', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 29, y: 29 };
        service.setRectangleHeight();
        service.setRectangleWidth();
        expect(service.rectangleWidth).toEqual(1);
    });

    it('should get number from calculation of rectangleHeight', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 25, y: 25 };
        service.setRectangleHeight();
        service.setRectangleWidth();
        expect(service.rectangleHeight).toEqual(service.firstPoint.y - service.lastPoint.x);
    });

    it('should drawSquare if mouse is down and shift is pressed', () => {
        service.onMouseDown(mouseEvent);
        const event = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        service.onKeyDown(event);
        expect(drawSquareSpy).toHaveBeenCalled();
    });
    it('should drawRect if mouse is down and shift is unpressed', () => {
        service.onMouseDown(mouseEvent);
        service.isShiftKeyDown = true;
        const event = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        service.onKeyUp(event);
        expect(drawRectSpy).toHaveBeenCalled();
    });

    it('should drawShape when mouse is down on mousemove', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 26,
            button: MouseButton.Left,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEventLClick);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('should finTopLeftPoint if firstPoint is top left corner', () => {
        // Top left is first point
        service.firstPoint = { x: 1, y: 1 };
        service.lastPoint = { x: 2, y: 2 };
        service.setRectangleHeight();
        service.setRectangleWidth();
        const topLeft = service.findTopLeftPoint(service.rectangleWidth, service.rectangleHeight);
        expect(topLeft).toEqual(service.firstPoint);
    });

    it('should finTopLeftPoint if firstPoint is top right corner', () => {
        // top left is left by width of first point
        service.firstPoint = { x: 2, y: 2 };
        service.lastPoint = { x: 1, y: 3 };
        service.setRectangleHeight();
        service.setRectangleWidth();
        const topLeft = service.findTopLeftPoint(service.rectangleWidth, service.rectangleHeight);
        const expectedValue: Vec2 = { x: 1, y: 2 };
        expect(topLeft).toEqual(expectedValue);
    });

    it('should finTopLeftPoint if firstPoint is bottom left corner', () => {
        // top left is up by heigth of first point
        service.firstPoint = { x: 1, y: 2 };
        service.lastPoint = { x: 2, y: 1 };
        service.setRectangleHeight();
        service.setRectangleWidth();
        const topLeft = service.findTopLeftPoint(service.rectangleWidth, service.rectangleHeight);
        const expectedValue: Vec2 = { x: 1, y: 1 };
        expect(topLeft).toEqual(expectedValue);
    });

    it('should finTopLeftPoint if firstPoint is bottom right corner', () => {
        // top left is last point
        service.firstPoint = { x: 3, y: 3 };
        service.lastPoint = { x: 2, y: 2 };
        service.setRectangleHeight();
        service.setRectangleWidth();
        const topLeft = service.findTopLeftPoint(service.rectangleWidth, service.rectangleHeight);
        const expectedValue: Vec2 = { x: 2, y: 2 };
        expect(topLeft).toEqual(expectedValue);
    });

    it('should call fillRect if option is not to draw only the border', () => {
        service.fillStyle = FILL_STYLES.FILL;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it('should not call fillRect if option is not to draw only the border', () => {
        service.fillStyle = FILL_STYLES.BORDER;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it('should not set isShiftKeyDown to true if key down of anything else than shift', () => {
        service.isShiftKeyDown = false;
        const event = new KeyboardEvent('keypress', {
            key: 'Ctrl',
        });
        service.onKeyDown(event);
        expect(service.isShiftKeyDown).toEqual(false);
    });

    it('should not draw anything if key up of shift but not mousedown', () => {
        service.isShiftKeyDown = true;
        const event = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        service.mouseDown = false;
        service.onKeyUp(event);
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('should not draw anything on detection of mouse up if it was not down', () => {
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('should not draw anything on detection of mouse move if it was not down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('should fill square if style is not set to border', () => {
        service.isShiftKeyDown = true;
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 26,
            button: MouseButton.Left,
        } as MouseEvent;
        service.fillStyle = FILL_STYLES.FILL;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEventLClick);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it('should not fill square if style is set to border', () => {
        service.isShiftKeyDown = true;
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 26,
            button: MouseButton.Left,
        } as MouseEvent;
        service.fillStyle = FILL_STYLES.BORDER;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEventLClick);
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });
});
