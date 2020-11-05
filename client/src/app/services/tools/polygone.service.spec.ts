// import { CircleService } from '@app/services/tools/circle.service';
// import { Polygone } from './../../classes/tool-properties';
import { TestBed } from '@angular/core/testing';
import { Polygone } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton, Quadrant } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygoneService } from './polygone.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable:no-string-literal
describe('PolygoneService', () => {
    let service: PolygoneService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable-next-line: prefer-const
    let drawPolygoneSpy: jasmine.Spy<any>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let previewCanvasStub: HTMLCanvasElement;
    let setCricleWidthSpy: jasmine.Spy<any>;
    let setCircleHeigthSpy: jasmine.Spy<any>;
    // let drawRectSpy: jasmine.Spy<any>;
    // let topLeftPointSpy: jasmine.Spy<any>;
    // let drawSquareSpy: jasmine.Spy<any>;
    // tslint:disable-next-line: prefer-const
    let ctxFillSpy: jasmine.Spy<any>;
    let colorPickerStub: ColorSelectionService;
    const WIDTH = 100;
    const HEIGHT = 100;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['updateStack']);
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = WIDTH;
        drawCanvas.height = HEIGHT;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        baseCtxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvasStub = canvas as HTMLCanvasElement;
        colorPickerStub = new ColorSelectionService();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorSelectionService, useValue: colorPickerStub },
                { provide: DrawingService, useValue: drawServiceSpy },
            ],
        });
        service = TestBed.inject(PolygoneService);
        drawPolygoneSpy = spyOn<any>(service, 'drawPolygone').and.callThrough();
        setCricleWidthSpy = spyOn<any>(service.circleService, 'setCircleWidth').and.callThrough();
        setCircleHeigthSpy = spyOn<any>(service.circleService, 'setCircleHeight').and.callThrough();
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].previewCanvas = previewCanvasStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.LEFT,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change the fillStyle', () => {
        service.fillStyle = FILL_STYLES.FILL;
        service.changeFillStyle(FILL_STYLES.BORDER);
        expect(service.fillStyle).toBe(FILL_STYLES.BORDER);
    });

    // it('should not change the fillStyle', () => {
    //     service.fillStyle = FILL_STYLES.FILL;
    //     service.changeFillStyle(FILL_STYLES.BORDER);
    //     expect(service.fillStyle).not.toBe(FILL_STYLES.BORDER);
    // });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('should change width', () => {
        service.width = 0;
        service.changeWidth(1);
        expect(service.width).toBe(1);
    });

    it('should not change width', () => {
        service.width = 1;
        service.changeWidth(4);
        expect(service.width).not.toBe(1);
    });

    it('should change sides', () => {
        service.sides = 0;
        service.changeSides(10);
        expect(service.sides).toBe(10);
    });

    it('should not change sides', () => {
        service.setSides = 8;
        service.changeSides(10);
        expect(service.sides).not.toBe(8);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.RIGHT,
        } as MouseEvent;
        service.circleService.onMouseDown(mouseEventRClick);
        expect(service.circleService.mouseDown).toEqual(false);
    });
    it('should drawShape when mouse is down on mousemove', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 26,
            button: MouseButton.LEFT,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEventLClick);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawServiceSpy.previewCanvas.style.cursor = 'none';
        service.handleCursor();
        expect(previewCanvasStub.style.cursor).toEqual('crosshair');
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawServiceSpy.previewCanvas.style.cursor = 'none';
        service.handleCursor();
        expect(previewCanvasStub.style.cursor).toEqual('crosshair');
    });

    it('should not draw anything on detection of mouse up if it was not down', () => {
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should not draw anything on detection of mouse move if it was not down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should not call fill if option is not to draw only the border', () => {
        service.fillStyle = FILL_STYLES.BORDER;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it('should call fillRect if option is not to draw only the border', () => {
        service.fillStyle = FILL_STYLES.FILL;
        service['drawingService'] = drawServiceSpy;
        // drawServiceSpy.updateStack.and.callThrough();
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it('should get number from calculation of circleWidth', () => {
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 29, y: 29 };
        service.setCircleHeight();
        service.setCircleWidth();
        service.circleService.circleWidth = 1;
        expect(service.circleWidth).toBe(1);
    });

    it('drawCircle should call setCircleHeight and setCircleWidth', () => {
        // const point: Vec2 = { x: 0, y: 0 };
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 29, y: 29 };
        service.drawCircle(baseCtxStub);
        expect(setCircleHeigthSpy).toHaveBeenCalled();
        expect(setCricleWidthSpy).toHaveBeenCalled();
    });

    it('drawCircle should call setCircleHeight and setCircleWidth', () => {
        // const point: Vec2 = { x: 0, y: 0 };
        service.firstPoint = { x: 30, y: 30 };
        service.lastPoint = { x: 31, y: 31 };
        service.drawCircle(baseCtxStub);
        expect(setCircleHeigthSpy).toHaveBeenCalled();
        expect(setCricleWidthSpy).toHaveBeenCalled();
    });

    it('drawCircle should call setCircleHeight and setCircleWidth', () => {
        const point: Vec2 = { x: 0, y: 0 };
        service.circleService.firstPoint = { x: 30, y: 30 };
        service.circleService.lastPoint = { x: 29, y: 31 };
        service.circleService.drawCircle(baseCtxStub, point);
        expect(setCircleHeigthSpy).toHaveBeenCalled();
        expect(setCricleWidthSpy).toHaveBeenCalled();
    });

    it('should set sides', () => {
        service.sides = 0;
        service.setSides = 10;
        expect(service.sides).toBe(10);
    });
    it('should set centerX', () => {
        service.centerX = 0;
        let firstPoint: Vec2 = { x: 20, y: 20 };
        let lastPoint: Vec2 = { x: 10, y: 10 };
        service.lastPoint = lastPoint;
        service.firstPoint = firstPoint;
        service.setCenterX();
        expect(service.centerX).toEqual(10);
        firstPoint = { x: 20, y: 10 };
        lastPoint = { x: 10, y: 20 };
        service.setCenterX();
        expect(service.centerX).toEqual(10);
    });

    it('should set centerY', () => {
        service.centerY = 0;
        let firstPoint: Vec2 = { x: 20, y: 20 };
        let lastPoint: Vec2 = { x: 10, y: 10 };
        service.lastPoint = lastPoint;
        service.firstPoint = firstPoint;
        service.setCenterY();
        expect(service.centerY).toEqual(10);
        firstPoint = { x: 20, y: 10 };
        lastPoint = { x: 10, y: 20 };
        service.setCenterY();
        expect(service.centerY).toEqual(10);
    });

    it('should find the top left quadrant', () => {
        const point1: Vec2 = { x: 20, y: 20 };
        const point2: Vec2 = { x: 10, y: 10 };
        service.polygoneData = {} as Polygone;
        service.polygoneData.firstPoint = point1;
        service.polygoneData.lastPoint = point2;
        service.polygoneData.circleWidth = 10;
        service.polygoneData.circleHeight = 10;
        const quadrant = service.trigonometry.findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service.polygoneData);
        expect(quadrant).toBe(Quadrant.TOP_LEFT);
    });

    it('should find the top right quadrant', () => {
        const point1: Vec2 = { x: 10, y: 20 };
        const point2: Vec2 = { x: 20, y: 10 };
        service.polygoneData = {} as Polygone;
        service.polygoneData.firstPoint = point1;
        service.polygoneData.lastPoint = point2;
        service.polygoneData.circleWidth = 10;
        service.polygoneData.circleHeight = 10;
        const quadrant = service.trigonometry.findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service.polygoneData);
        expect(quadrant).toBe(Quadrant.TOP_RIGHT);
    });

    it('should find the bottom left quadrant', () => {
        const point1: Vec2 = { x: 20, y: 10 };
        const point2: Vec2 = { x: 10, y: 20 };
        service.polygoneData = {} as Polygone;
        service.polygoneData.firstPoint = point1;
        service.polygoneData.lastPoint = point2;
        service.polygoneData.circleWidth = 10;
        service.polygoneData.circleHeight = 10;
        const quadrant = service.trigonometry.findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service.polygoneData);
        expect(quadrant).toBe(Quadrant.BOTTOM_LEFT);
    });
});
