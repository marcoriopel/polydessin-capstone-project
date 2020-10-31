import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PipetteService } from './pipette.service';

describe('PipetteService', () => {
    let service: PipetteService;
    let canvas: HTMLCanvasElement;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let zoomCtxStud: CanvasRenderingContext2D;
    let zoomCanvasStud: HTMLCanvasElement;
    let mouseEventLeft: MouseEvent;
    let mouseEventRight: MouseEvent;
    let colorStud: string[];

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCanvasStub: HTMLCanvasElement;
    const WIDTH_DRAWING_CANVAS = 100;
    const HEIGHT_DRAWING_CANVAS = 100;
    const WIDTH_ZOOM_CANVAS = 50;
    const HEIGHT_ZOOM_CANVAS = 50;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        canvas = document.createElement('canvas');
        canvas.width = WIDTH_DRAWING_CANVAS;
        canvas.height = HEIGHT_DRAWING_CANVAS;
        colorStud = ['#000000', '255'];
        baseCtxStub = canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCanvasStub = canvas as HTMLCanvasElement;
        baseCtxStub.fillStyle = '#000000';
        baseCtxStub.fillRect(0, 0, canvas.width, canvas.height);
        baseCtxStub.fill();
        baseCtxStub.stroke();

        const zoomCanvas = document.createElement('canvas') as HTMLCanvasElement;
        zoomCanvas.width = WIDTH_ZOOM_CANVAS;
        zoomCanvas.height = HEIGHT_ZOOM_CANVAS;
        zoomCanvasStud = zoomCanvas;
        zoomCtxStud = zoomCanvasStud.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(PipetteService);

        // tslint:disable-next-line: no-string-literal
        service['drawingService'].canvas = canvas;
        // tslint:disable-next-line: no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        // tslint:disable-next-line: no-string-literal
        service['drawingService'].previewCanvas = previewCanvasStub;
        service.zoom = zoomCanvasStud;
        service.zoomCtx = zoomCtxStud;

        mouseEventLeft = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        mouseEventRight = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set cursor to crosshair on handleCursorCall with previewLayer correctly loaded', () => {
        drawServiceSpy.previewCanvas.style.cursor = 'none';
        service.handleCursor();
        expect(previewCanvasStub.style.cursor).toEqual('crosshair');
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEventLeft);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should emit an event on left click', () => {
        const eventEmiterSpy = spyOn(service.primaryColor, 'emit');
        service.onMouseDown(mouseEventLeft);
        expect(eventEmiterSpy).toHaveBeenCalledWith(colorStud);
    });

    it(' mouseDown should emit an event on right click', () => {
        const eventEmiterSpy = spyOn(service.secondaryColor, 'emit');
        service.onMouseDown(mouseEventRight);
        expect(eventEmiterSpy).toHaveBeenCalledWith(colorStud);
    });

    it(' mouseMove should call handleNearBorder', () => {
        const drawOnZoomSpy = spyOn(service, 'drawOnZoom');
        const nearBorderSpy = spyOn(service, 'handleNearBorder');
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseMove(mouseEventLeft);
        expect(nearBorderSpy).toHaveBeenCalled();
        expect(service.isNearBorder).toEqual(false);
        expect(drawOnZoomSpy).toHaveBeenCalled();
    });

    it('Should copy the canvas in zoom', () => {
        const copyctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        copyctx.beginPath();
        copyctx.fill();
        copyctx.stroke();
        const imageData = copyctx.getImageData(25, 25, 1, 1);
        console.log(imageData);
        service.drawOnZoom(mouseEventLeft);

        const zoomCtxData = service.zoomCtx.getImageData(zoomCanvasStud.width / 2, zoomCanvasStud.height / 2, 1, 1);
        console.log(zoomCtxData);
        expect(zoomCtxData).toEqual(imageData);
    });

    it('Should return true when mouse near a border', () => {
        const mouseDownCoord = { x: 0, y: 0 };
        service.handleNearBorder(mouseDownCoord);
        expect(service.isNearBorder).toEqual(true);
    });

    it('Should return true when mouse outside border', () => {
        const mouseDownCoord = { x: 101, y: 101 };
        service.handleNearBorder(mouseDownCoord);
        expect(service.isNearBorder).toEqual(true);
    });

    it('Should return false when mouse inside the canvas', () => {
        const mouseDownCoord = { x: 25, y: 25 };
        service.handleNearBorder(mouseDownCoord);
        expect(service.isNearBorder).toEqual(false);
    });

    it('Should call drawOnZoom when not near a border', () => {
        const drawOnZoom = spyOn(service, 'drawOnZoom');
        service.isNearBorder = false;
        service.showZoomPixel(mouseEventLeft);
        expect(drawOnZoom).toHaveBeenCalled();
    });

    it('Should not call drawOnZoom when near a border', () => {
        const drawOnZoom = spyOn(service, 'drawOnZoom');
        service.isNearBorder = true;
        service.showZoomPixel(mouseEventLeft);
        expect(drawOnZoom).not.toHaveBeenCalled();
    });

    it('Should emit an event and clear zoom when mouse near a border', () => {
        const eventEmiterSpy = spyOn(service.mouseOut, 'next');
        const clearCanvasSpy = spyOn(service, 'clearCanvas');
        const mouseDownCoord = { x: 0, y: 0 };
        service.handleNearBorder(mouseDownCoord);
        expect(eventEmiterSpy).toHaveBeenCalledWith(false);
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('Should emit a event on mouse leave', () => {
        const eventEmiterSpy = spyOn(service.mouseOut, 'next');
        service.onMouseLeave();
        expect(eventEmiterSpy).toHaveBeenCalledWith(false);
    });

    it('Should emit a event on mouse enter', () => {
        const eventEmiterSpy = spyOn(service.mouseOut, 'next');
        service.onMouseEnter();
        expect(eventEmiterSpy).toHaveBeenCalledWith(true);
    });
});
