import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_RESIZING_POINTS } from '@app/ressources/global-variables/canvas-resizing-points';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { ResizeDrawingService } from './resize-drawing.service';

describe('ResizeDrawingService', () => {
    let service: ResizeDrawingService;
    let mouseEvent: MouseEvent;
    let target: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeDrawingService);

        target = {
            id: CANVAS_RESIZING_POINTS.VERTICAL,
        } as HTMLElement;

        mouseEvent = ({
            clientX: 500,
            clientY: 500,
            target,
            button: MouseButton.Left,
        } as unknown) as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set default canvas size to half workspace size', () => {
        service.setDefaultCanvasSize({ x: 800, y: 900 });
        expect(service.canvasSize).toEqual({ x: 400, y: 450 });
    });

    it('should set default canvas size to minimum canvas size', () => {
        service.setDefaultCanvasSize({ x: 200, y: 200 });
        expect(service.canvasSize).toEqual({ x: 250, y: 250 });
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            button: MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 500, y: 500 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set serviceCaller to correct value', () => {
        const expectedResult = CANVAS_RESIZING_POINTS.VERTICAL;
        service.onMouseDown(mouseEvent);
        expect(service.serviceCaller).toEqual(expectedResult);
    });

    it('mouseUp should set mouseDown to false and return true if mouseDown is initially true', () => {
        service.mouseDown = true;
        expect(service.onMouseUp()).toBe(true);
        expect(service.mouseDown).toBe(false);
    });

    it('mouseUp should leave mouseDown to false and return false if mouseDown is initially false', () => {
        service.mouseDown = false;
        expect(service.onMouseUp()).toBe(false);
        expect(service.mouseDown).toBe(false);
    });

    it('should get position from mouse', () => {
        expect(service.getPositionFromMouse(mouseEvent)).toEqual({ x: 500, y: 500 });
    });

    it('should change canvasSize width', () => {
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 200, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.VERTICAL;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 500 });
    });

    it('should not change canvasSize width', () => {
        const localMouseEvent = ({
            clientX: 50,
            clientY: 50,
        } as unknown) as MouseEvent;
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 200, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.VERTICAL;
        service.resizeCanvas(localMouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });

    it('should not change canvasSize on verticalResize', () => {
        service.mouseDown = false;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 200, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.VERTICAL;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });

    it('should change canvasSize height', () => {
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 400, y: 200 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.HORIZONTAL;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 500, y: 400 });
    });

    it('should not change canvasSize height', () => {
        const localMouseEvent = ({
            clientX: 50,
            clientY: 50,
        } as unknown) as MouseEvent;
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 400, y: 200 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.HORIZONTAL;
        service.resizeCanvas(localMouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });

    it('should not change canvasSize on horizontalResize', () => {
        service.mouseDown = false;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 200, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.HORIZONTAL;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });

    it('should change canvasSize height and width', () => {
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 400, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.VERTICAL_AND_HORIZONTAL;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 500, y: 500 });
    });

    it('should not change canvasSize height and width', () => {
        const localMouseEvent = ({
            clientX: 50,
            clientY: 50,
        } as unknown) as MouseEvent;
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 400, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.VERTICAL_AND_HORIZONTAL;
        service.resizeCanvas(localMouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });

    it('should not change canvasSize on verticalAndHorizontalResize', () => {
        service.mouseDown = false;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 200, y: 400 };
        service.serviceCaller = CANVAS_RESIZING_POINTS.VERTICAL_AND_HORIZONTAL;
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });

    it('should not change canvasSize on resizeCanvas', () => {
        service.mouseDown = true;
        service.canvasSize = { x: 400, y: 400 };
        service.mouseDownCoord = { x: 200, y: 400 };
        service.serviceCaller = 'not an actual possibility';
        service.resizeCanvas(mouseEvent);
        expect(service.canvasSize).toEqual({ x: 400, y: 400 });
    });
});
