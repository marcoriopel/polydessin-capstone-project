// import { CircleService } from '@app/services/tools/circle.service';
// import { Polygone } from './../../classes/tool-properties';
import { TestBed } from '@angular/core/testing';
import { Polygon } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton, Quadrant } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CircleService } from './circle.service';
import { PolygonService } from './polygon.service';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable:no-string-literal
describe('PolygonService', () => {
    let service: PolygonService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let circleServiceSpy: jasmine.SpyObj<CircleService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let previewCanvasStub: HTMLCanvasElement;
    let colorPickerStub: ColorSelectionService;
    const WIDTH = 100;
    const HEIGHT = 100;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['updateStack', 'clearCanvas', 'setIsToolInUse', 'autoSave']);
        circleServiceSpy = jasmine.createSpyObj('CircleService', ['drawCircle', 'changeFillStyle', 'setFillStyle']);
        circleServiceSpy.ellipseData = {
            type: 'ellipse',
            primaryColor: 'red',
            secondaryColor: 'blue',
            center: { x: 0, y: 0 },
            radius: { x: 0, y: 0 },
            fillStyle: FILL_STYLES.FILL_AND_BORDER,
            isShiftDown: false,
            lineWidth: 1,
            firstPoint: { x: 0, y: 0 },
            lastPoint: { x: 0, y: 0 },
        };
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = WIDTH;
        drawCanvas.height = HEIGHT;

        baseCtxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvasStub = canvas as HTMLCanvasElement;
        colorPickerStub = new ColorSelectionService();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorSelectionService, useValue: colorPickerStub },
                { provide: CircleService, useValue: circleServiceSpy },
            ],
        });
        service = TestBed.inject(PolygonService);
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

    it('should set lineJoin', () => {
        service.initialize();

        expect(previewCtxStub.lineJoin).toEqual('miter');
        expect(baseCtxStub.lineJoin).toEqual('miter');
    });

    it('should change the fillStyle', () => {
        service['polygonData'].fillStyle = FILL_STYLES.FILL;
        service.changeFillStyle(FILL_STYLES.BORDER);
        expect(service['polygonData'].fillStyle).toBe(FILL_STYLES.BORDER);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('should change width', () => {
        service['polygonData'].lineWidth = 0;
        service.changeWidth(1);
        expect(service['polygonData'].lineWidth).toBe(1);
    });

    it('should not change width', () => {
        service['polygonData'].lineWidth = 1;
        service.changeWidth(4);
        expect(service['polygonData'].lineWidth).not.toBe(1);
    });

    it('should drawShape when mouse is down on mousemove', () => {
        const drawPolygoneSpy = spyOn<any>(service, 'drawPolygone');
        service['polygonData'].firstPoint = { x: 30, y: 30 };
        service['polygonData'].lastPoint = { x: 31, y: 31 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('should not draw anything on detection of mouse up if it was not down', () => {
        const drawPolygoneSpy = spyOn<any>(service, 'drawPolygone');

        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should not draw anything on detection of mouse move if it was not down', () => {
        const drawPolygoneSpy = spyOn<any>(service, 'drawPolygone');

        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should call fill also if option is not to draw only the border', () => {
        const ctxFillSpy = spyOn<any>(baseCtxStub, 'fill');
        service['polygonData'].fillStyle = FILL_STYLES.FILL;
        service['polygonData'] = {
            type: 'polygone',
            primaryColor: 'black',
            secondaryColor: 'black',
            fillStyle: 0,
            lineWidth: 1,
            circleHeight: 5,
            circleWidth: 5,
            firstPoint: { x: 30, y: 30 },
            lastPoint: { x: 20, y: 20 },
            sides: 3,
        };
        service.drawPolygone(baseCtxStub, service['polygonData']);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it('should get number from calculation of circleWidth', () => {
        service['polygonData'].firstPoint = { x: 30, y: 30 };
        service['polygonData'].lastPoint = { x: 29, y: 29 };
        service.setCircleHeight();
        service.setCircleWidth();
        service.circleService.circleWidth = 1;
        expect(service['polygonData'].circleWidth).toBe(1);
    });

    it('drawCircle should call drawCircle of circleService', () => {
        service['polygonData'].firstPoint = { x: 30, y: 30 };
        service['polygonData'].lastPoint = { x: 29, y: 29 };
        service.drawCircle(baseCtxStub);
        expect(circleServiceSpy.drawCircle).toHaveBeenCalled();
    });

    it('drawPolygone should call setCircleHeight and setCircleWidth', () => {
        const setCricleWidthSpy = spyOn<any>(service, 'setCircleWidth');
        const setCircleHeigthSpy = spyOn<any>(service, 'setCircleHeight');
        service['polygonData'] = {
            type: 'polygone',
            primaryColor: 'black',
            secondaryColor: 'black',
            fillStyle: 0,
            lineWidth: 1,
            circleHeight: 1,
            circleWidth: 1,
            firstPoint: { x: 30, y: 30 },
            lastPoint: { x: 29, y: 29 },
            sides: 3,
        };
        service.drawPolygone(baseCtxStub, service['polygonData']);
        expect(setCircleHeigthSpy).toHaveBeenCalled();
        expect(setCricleWidthSpy).toHaveBeenCalled();
    });

    it('should set centerX', () => {
        service.centerX = 0;
        let firstPoint: Vec2 = { x: 20, y: 20 };
        let lastPoint: Vec2 = { x: 10, y: 10 };
        service['polygonData'].lastPoint = lastPoint;
        service['polygonData'].firstPoint = firstPoint;
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
        service['polygonData'].lastPoint = lastPoint;
        service['polygonData'].firstPoint = firstPoint;
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
        service['polygonData'] = {} as Polygon;
        service['polygonData'].firstPoint = point1;
        service['polygonData'].lastPoint = point2;
        service['polygonData'].circleWidth = 10;
        service['polygonData'].circleHeight = 10;
        const quadrant = service['trigonometry'].findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service['polygonData']);
        expect(quadrant).toBe(Quadrant.TOP_LEFT);
    });

    it('should find the top right quadrant', () => {
        const point1: Vec2 = { x: 10, y: 20 };
        const point2: Vec2 = { x: 20, y: 10 };
        service['polygonData'] = {} as Polygon;
        service['polygonData'].firstPoint = point1;
        service['polygonData'].lastPoint = point2;
        service['polygonData'].circleWidth = 10;
        service['polygonData'].circleHeight = 10;
        const quadrant = service['trigonometry'].findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service['polygonData']);
        expect(quadrant).toBe(Quadrant.TOP_RIGHT);
    });

    it('should find the bottom left quadrant', () => {
        const point1: Vec2 = { x: 20, y: 10 };
        const point2: Vec2 = { x: 10, y: 20 };
        service['polygonData'] = {} as Polygon;
        service['polygonData'].firstPoint = point1;
        service['polygonData'].lastPoint = point2;
        service['polygonData'].circleWidth = 10;
        service['polygonData'].circleHeight = 10;
        const quadrant = service['trigonometry'].findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service['polygonData']);
        expect(quadrant).toBe(Quadrant.BOTTOM_LEFT);
    });

    it('should find the bottom right quadrant', () => {
        const point1: Vec2 = { x: 10, y: 10 };
        const point2: Vec2 = { x: 20, y: 20 };
        service['polygonData'] = {} as Polygon;
        service['polygonData'].firstPoint = point1;
        service['polygonData'].lastPoint = point2;
        service['polygonData'].circleWidth = 10;
        service['polygonData'].circleHeight = 10;
        const quadrant = service['trigonometry'].findQuadrant(point1, point2);
        service.drawPolygone(baseCtxStub, service['polygonData']);
        expect(quadrant).toBe(Quadrant.BOTTOM_RIGHT);
    });

    it('should draw polygone on mouseUp if mouse was down', () => {
        const drawPolygoneSpy = spyOn<any>(service, 'drawPolygone');
        service['polygonData'].firstPoint = { x: 0, y: 0 };
        service['polygonData'].lastPoint = { x: 5, y: 5 };
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('should not draw polygone on mouseUp if first point is same as last point', () => {
        const drawPolygoneSpy = spyOn<any>(service, 'drawPolygone');
        const getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse');
        getPositionFromMouseSpy.and.returnValue({ x: 0, y: 0 });
        service['polygonData'].firstPoint = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseUp({} as MouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.autoSave).toHaveBeenCalled();
    });

    it('should not get position from mouse if not mouse down', () => {
        const mouseRightclick = ({
            clientX: 500,
            clientY: 500,
            button: MouseButton.RIGHT,
        } as unknown) as MouseEvent;
        service.mouseDown = false;
        const positionSpy = spyOn<any>(service, 'getPositionFromMouse');
        service.onMouseDown(mouseRightclick);
        expect(positionSpy).not.toHaveBeenCalled();
    });

    it('should call stroke on drawPolygone if ctx is preview', () => {
        const strokeSpy = spyOn(previewCtxStub, 'stroke');
        service['polygonData'] = {
            type: 'polygone',
            primaryColor: 'black',
            secondaryColor: 'black',
            fillStyle: 0,
            lineWidth: 1,
            circleHeight: 1,
            circleWidth: 1,
            firstPoint: { x: 30, y: 30 },
            lastPoint: { x: 29, y: 29 },
            sides: 3,
        };
        service.drawPolygone(previewCtxStub, service['polygonData']);
        expect(strokeSpy).toHaveBeenCalled();
    });
    // tslint:disable-next-line: max-file-line-count
});
