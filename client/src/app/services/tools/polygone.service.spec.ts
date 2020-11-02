import { TestBed } from '@angular/core/testing';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
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
    let drawShapeSpy: jasmine.Spy<any>;
    let previewCanvasStub: HTMLCanvasElement;
    let ctxFillSpy: jasmine.Spy<any>;
    let colorPickerStub: ColorSelectionService;
    const WIDTH = 100;
    const HEIGHT = 100;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const drawCanvas = document.createElement('canvas');
        drawCanvas.width = WIDTH;
        drawCanvas.height = HEIGHT;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        previewCanvasStub = canvas as HTMLCanvasElement;
        colorPickerStub = new ColorSelectionService();

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorSelectionService, useValue: colorPickerStub },
            ],
        });
        service = TestBed.inject(PolygoneService);

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

    it('should not change the fillStyle', () => {
        service.fillStyle = FILL_STYLES.FILL;
        service.changeFillStyle(FILL_STYLES.BORDER);
        expect(service.fillStyle).not.toBe(FILL_STYLES.BORDER);
    });

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
        service.width = 0;
        service.changeWidth(1);
        expect(service.width).not.toBe(1);
    });

    it('should change sides', () => {
        service.setSides = 8;
        service.changeSides(10);
        expect(service.sides).toBe(10);
    });

    it('should not change sides', () => {
        service.setSides = 8;
        service.changeSides(10);
        expect(service.sides).not.toBe(10);
    });

    // it('should change line width', () => {
    //     service.lineWidth = 0;
    //     service.changeLineWidth(1);
    //     expect(service.lineWidth).toBe(1);
    // });

    // it('should not change line width', () => {
    //     service.lineWidth = 0;
    //     service.changeLineWidth(1);
    //     expect(service.lineWidth).not.toBe(1);
    // });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.RIGHT,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });
    it('should drawShape when mouse is down on mousemove', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 26,
            button: MouseButton.LEFT,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEventLClick);
        expect(drawShapeSpy).toHaveBeenCalled();
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
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('should not draw anything on detection of mouse move if it was not down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('should not call fillRect if option is not to draw only the border', () => {
        service.fillStyle = FILL_STYLES.BORDER;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it('should call fillRect if option is not to draw only the border', () => {
        service.fillStyle = FILL_STYLES.FILL;
        service.onMouseDown(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    // it('should find the radius ', () => {
    //     // top left is last point
    //     service.firstPoint = { x: 3, y: 3 };
    //     service.lastPoint = { x: 2, y: 2 };
    //     const R = service.radius;
    //     expect(R).toEqual(R);
    // });

    // it('should not equal the radius ', () => {
    //     // top left is last point
    //     service.firstPoint = { x: 3, y: 3 };
    //     service.lastPoint = { x: 2, y: 2 };
    //     const R = service.radius;
    //     expect(R).not.toEqual(R);
    // });

    // it('should finTopLeftPoint if firstPoint is top right corner', () => {
    //     service.firstPoint = { x: 5, y: 5 };
    //     service.lastPoint = { x: 15, y: 15 };
    //     service.setCenterX();
    //     service.setCenterY();
    //     const centerValue = service.getCenter();
    //     const expectedValue: Vec2 = { x: 10, y: 10 };
    //     expect(centerValue).toEqual(expectedValue);
    // });
});
