import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Line } from '@app/classes/line';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '../drawing/drawing.service';
import { LineService } from './line.service';

fdescribe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        service = TestBed.inject(LineService);

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
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
        service.lineWidth = 0;
        service.changeLineWidth(1);
        expect(service.lineWidth).toBe(1);
    });

    it('should change dot width', () => {
        service.dotWidth = 0;
        service.changeDotWidth(1);
        expect(service.dotWidth).toBe(1);
    });

    it('should change junction type', () => {
        service.isDot = false;
        service.changeJunction(true);
        expect(service.isDot).toBe(true);
    });

    it('mouse up should add a click to mouseclicks', () => {
        service.onMouseUp(mouseEvent);
        expect(service.mouseClicks[0].x).toEqual(mouseEvent.offsetX);
        expect(service.mouseClicks[0].y).toEqual(mouseEvent.offsetY);
    });

    it('mouse up should update the number of clicks', () => {
        service.onMouseUp(mouseEvent);
        expect(service.numberOfClicks).toBe(1);
    });

    it('mouse up should set drawing bool to true on single click', () => {
        service.onMouseUp(mouseEvent);
        expect(service.isDrawing).toBe(true);
    });

    it('mouse up should set is drawing to false on double click', () => {
        service.onMouseUp(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(service.isDrawing).toBe(false);
    });

    it('mouse up should reset the mouse clicks list if double click when not drawing a line', () => {
        service.onMouseUp(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(service.mouseClicks).toEqual([]);
    });

    it('mouse up should reset the number mouse clicks if double click when not drawing a line', () => {
        service.onMouseUp(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(service.numberOfClicks).toBe(0);
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

    it('last segment of line should be deleted when releasing backspace', () => {
        const deleteLastSegmentSpy = spyOn<any>(service, 'deleteLastSegment');
        const event = new KeyboardEvent('keypress', {
            key: 'Backspace',
        });
        service.numberOfClicks = 2;
        service.onKeyUp(event);
        expect(deleteLastSegmentSpy).toHaveBeenCalled();
    });

    it('line should be deleted when escape key is released', () => {
        const deleteLineSpy = spyOn<any>(service, 'deleteLine');
        const event = new KeyboardEvent('keypress', {
            key: 'Escape',
        });
        service.onKeyUp(event);
        expect(deleteLineSpy).toHaveBeenCalled();
    });

    it('should return false if the two last clicks are different', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 10 };
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);
        service.numberOfClicks = 2;
        const returnValue: boolean = service.checkIfDoubleClick();
        expect(returnValue).toBe(false);
    });

    // WTF
    it('should remove last storedLine, last mouseClick and decrement numberOfClicks', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 11 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.storedLines.push(line);
        service.mouseClicks.push(click2);
        service.numberOfClicks = 1;

        service.deleteLastSegment();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(service.storedLines.length).toBe(0);
        expect(service.mouseClicks.length).toBe(0);
        expect(service.numberOfClicks).toBe(0);
    });

    it('should call clearCanvas and drawLine', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');

        service.deleteLastSegment();

        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should call drawDots', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const drawDots = spyOn<any>(service, 'drawDots');
        service.isDot = true;

        service.deleteLastSegment();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawDots).toHaveBeenCalled();
    });

    it('should set isDrawing to be false', () => {
        service.deleteLine();
        expect(service.isDrawing).toBe(false);
    });

    it('should reset storedLines, mouseClicks and numberOfClicks', () => {
        service.onMouseUp(mouseEvent);
        service.deleteLine();
        expect(service.storedLines).toEqual([]);
        expect(service.mouseClicks).toEqual([]);
        expect(service.numberOfClicks).toEqual(0);
    });
});
