import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Line } from '@app/classes/line';
import { Vec2 } from '@app/classes/vec2';
import { LineAngle, MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

//                                                         tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('LineService', () => {
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
        service.numberOfClicks = 0;
        service.onMouseUp(mouseEvent);
        expect(service.numberOfClicks).toBe(1);
    });

    it('mouse up should set drawing bool to true on single click', () => {
        service.onMouseUp(mouseEvent);
        expect(service.isDrawing).toBe(true);
    });

    it('mouse up should set is drawing to false on double click', () => {
        service.isDrawing = true;
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
        service.numberOfClicks = 1;
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

    it('should return true if the two last clicks are the same', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 10, y: 10 };
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);
        service.numberOfClicks = 2;
        const returnValue: boolean = service.checkIfDoubleClick();
        expect(returnValue).toBe(true);
    });

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

    it('should replace last point with initial point', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const click1: Vec2 = { x: 20, y: 20 };
        const click2: Vec2 = { x: 25, y: 25 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.storedLines.push(line);
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);

        service.onMouseUp(mouseEvent);
        service.onMouseUp(mouseEvent);

        expect(service.mouseClicks[service.mouseClicks.length - 1]).toEqual(service.mouseClicks[0]);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call draw dot', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const drawDotsSpy = spyOn<any>(service, 'drawDots');
        const click1: Vec2 = { x: 20, y: 20 };
        const click2: Vec2 = { x: 25, y: 25 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.isDot = true;
        service.storedLines.push(line);
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);

        service.onMouseUp(mouseEvent);
        service.onMouseUp(mouseEvent);

        expect(service.mouseClicks[service.mouseClicks.length - 1]).toEqual(service.mouseClicks[0]);
        expect(drawDotsSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should not call draw dot', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const drawDotsSpy = spyOn<any>(service, 'drawDots');
        const click1: Vec2 = { x: 20, y: 20 };
        const click2: Vec2 = { x: 25, y: 25 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.isDot = false;
        service.storedLines.push(line);
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);

        service.onMouseUp(mouseEvent);
        service.onMouseUp(mouseEvent);

        expect(service.mouseClicks[service.mouseClicks.length - 1]).toEqual(service.mouseClicks[0]);
        expect(drawDotsSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call draw line (to draw a segment)', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const click1: Vec2 = { x: 20, y: 20 };
        service.mouseClicks.push(click1);

        service.onMouseUp(mouseEvent);

        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call draw dots (when drawing a segment)', () => {
        const drawDotsSpy = spyOn<any>(service, 'drawDots');
        const drawLineSpy = spyOn<any>(service, 'drawLine');

        const click1: Vec2 = { x: 20, y: 20 };
        service.mouseClicks.push(click1);
        service.isDot = true;
        service.onMouseUp(mouseEvent);

        expect(drawDotsSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('stored line should correspond to mouse clicks', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');

        const click1: Vec2 = { x: 20, y: 20 };
        service.mouseClicks.push(click1);
        service.isDot = true;
        service.onMouseUp(mouseEvent);

        expect(service.storedLines[0].startingPoint).toEqual(click1);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('last click in mouseClicks should equal ending coordinates of the line', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');

        const click1: Vec2 = { x: 20, y: 20 };
        service.mouseClicks.push(click1);
        service.isDot = true;
        service.onMouseUp(mouseEvent);

        expect(service.mouseClicks[service.mouseClicks.length - 1]).toEqual(service.storedLines[0].endingPoint);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should change mouse event attribute', () => {
        service.onMouseMove(mouseEvent);
        expect(service.mouseEvent).toEqual(mouseEvent);
    });

    it('should call clear canvas and drawLine', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        service.isDrawing = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call drawDots', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const drawDotsSpy = spyOn<any>(service, 'drawDots');
        service.isDrawing = true;
        service.isDot = true;
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawDotsSpy).toHaveBeenCalled();
    });

    it('should call drawLine', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        service.isDrawing = true;
        const click1: Vec2 = { x: 20, y: 20 };
        const click2: Vec2 = { x: 25, y: 25 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.storedLines.push(line);
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call adjustLineAngle when shift pressed down', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const adjustLineAngleSpy = spyOn<any>(service, 'adjustLineAngle');
        service.isDrawing = true;
        service.isShiftKeyDown = true;
        service.onMouseMove(mouseEvent);
        expect(adjustLineAngleSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('checkIf20pxAway should return false with points more than 20 px away', () => {
        const firstPoint: Vec2 = { x: 20, y: 20 };
        const secondPoint: Vec2 = { x: 50, y: 50 };
        const returnValue = service.checkIf20pxAway(firstPoint, secondPoint);
        expect(returnValue).toBe(false);
    });

    it('checkIf20pxAway should return true with points less than 20 px away', () => {
        const firstPoint: Vec2 = { x: 20, y: 20 };
        const secondPoint: Vec2 = { x: 25, y: 25 };
        const returnValue = service.checkIf20pxAway(firstPoint, secondPoint);
        expect(returnValue).toBe(true);
    });

    it('deleteLastSegment should redraw preview line when a segment is deleted', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine');
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 11 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.storedLines.push(line);
        service.storedLines.push(line);

        service.deleteLastSegment();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('adjustLineAngle should call adjustendingPoint', () => {
        const adjustEndingPointSpy = spyOn<any>(service, 'adjustEndingPoint');
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 11 };
        service.mouseClicks.push(click1);
        service.adjustLineAngle(click2);
        expect(adjustEndingPointSpy).toHaveBeenCalled();
    });

    // No conditions
    it('should reach if branch to make adjacent positive', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 9, y: 11 };
        service.mouseClicks.push(click1);
        service.adjustLineAngle(click2);
    });

    // No conditions
    it('should reach if branch to make oposite positive', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 9 };
        service.mouseClicks.push(click1);
        service.adjustLineAngle(click2);
    });

    // No conditions
    it('should reach if branch to change hypothenuse from 0 to 1', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 10, y: 10 };
        service.mouseClicks.push(click1);
        service.adjustLineAngle(click2);
    });

    it('should adjust line to 0 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 15, y: 11 };
        const adjacent = 5;
        const lineAngle: LineAngle = 0;
        const expectedPoint: Vec2 = { x: 15, y: 10 };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 45 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 15, y: 14 };
        const adjacent = 5;
        const lineAngle: LineAngle = 1;
        const expectedPoint: Vec2 = { x: 15, y: 10 - adjacent };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 90 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 11, y: 18 };
        const adjacent = 5;
        const lineAngle: LineAngle = 2;
        const expectedPoint: Vec2 = { x: 10, y: 18 };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 135 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 9, y: 18 };
        const adjacent = 5;
        const lineAngle: LineAngle = 3;
        const expectedPoint: Vec2 = { x: 9, y: 10 - adjacent };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 180 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 5, y: 11 };
        const adjacent = 5;
        const lineAngle: LineAngle = 4;
        const expectedPoint: Vec2 = { x: 5, y: 10 };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 225 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 5, y: 6 };
        const adjacent = 5;
        const lineAngle: LineAngle = 5;
        const expectedPoint: Vec2 = { x: 5, y: 10 + adjacent };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 270 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 10, y: 9 };
        const adjacent = 5;
        const lineAngle: LineAngle = 6;
        const expectedPoint: Vec2 = { x: 10, y: 9 };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should adjust line to 315 degrees', () => {
        const click1: Vec2 = { x: 10, y: 10 };
        const click2: Vec2 = { x: 14, y: 6 };
        const adjacent = 5;
        const lineAngle: LineAngle = 7;
        const expectedPoint: Vec2 = { x: 14, y: 10 + adjacent };

        service.mouseClicks.push(click1);
        service.adjustEndingPoint(lineAngle, click2, adjacent);
        expect(service.endingClickCoordinates).toEqual(expectedPoint);
    });

    it('should be a pixel on preview canvas on the line path (5px right on the horizontal) ', () => {
        const click1: Vec2 = { x: 0, y: 0 };
        const click2: Vec2 = { x: 1, y: 0 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.storedLines.push(line);

        service.drawLine(click1, click2, true, 1);
        // Premier pixel seulement
        const imageData: ImageData = previewCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('should be a pixel on base canvas on the line path (5px right on the horizontal) ', () => {
        const click1: Vec2 = { x: 0, y: 0 };
        const click2: Vec2 = { x: 1, y: 0 };
        const line: Line = { startingPoint: click1, endingPoint: click2 };
        service.storedLines.push(line);

        service.drawLine(click1, click2, false, 1);
        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('should be a pixel on preview canvas in the dot radius ', () => {
        const click1: Vec2 = { x: 0, y: 0 };
        const click2: Vec2 = { x: 5, y: 0 };
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);

        service.drawDots(2, true);
        // Premier pixel seulement
        const imageData: ImageData = previewCtxStub.getImageData(5, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('should be a pixel on base canvas in the dot radius ', () => {
        const click1: Vec2 = { x: 0, y: 0 };
        const click2: Vec2 = { x: 5, y: 0 };
        service.mouseClicks.push(click1);
        service.mouseClicks.push(click2);

        service.drawDots(2, false);
        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(5, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[3]).not.toEqual(0); // A
    });
    // tslint:disable-next-line: max-file-line-count
});
