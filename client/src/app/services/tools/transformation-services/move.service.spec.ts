import { TestBed } from '@angular/core/testing';
import { Rectangle } from '@app/classes/rectangle';
import { ARROW_KEYS } from '@app/ressources/global-variables/arrow-keys';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from './move.service';
import SpyObj = jasmine.SpyObj;

// tslint:disable: no-magic-numbers

describe('MoveService', () => {
    let service: MoveService;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let previewCtxSpy: SpyObj<CanvasRenderingContext2D>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        previewCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['putImageData']);
        drawingServiceSpy.previewCtx = previewCtxSpy;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(MoveService);

        const selection: Rectangle = { startingPoint: { x: 0, y: 0 }, width: 1, height: 1 };
        const selectionData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255]), height: 1, width: 1 };
        service.initialize(selection, selectionData);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize service', () => {
        const selection: Rectangle = { startingPoint: { x: 3, y: 3 }, width: 2, height: 1 };
        const selectionData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]), height: 1, width: 2 };
        service.initialize(selection, selectionData);

        expect(service.initialSelection).toEqual(selection);
        expect(service.selection).toEqual(selection);
        expect(service.selectionData).toEqual(selectionData);
    });

    it('onMouseDown should set isTransformationOver to false if isTransformationOver is true', () => {
        service.isTransformationOver = true;
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

        service.onMouseDown({} as MouseEvent);

        expect(service.isTransformationOver).toBe(false);
        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call printSelectionOnPreview if isTransformationOver is true', () => {
        service.isTransformationOver = true;
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

        service.onMouseDown({} as MouseEvent);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call printSelectionOnPreview', () => {
        service.isTransformationOver = true;
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

        service.onMouseMove({ movementX: 1, movementY: 1 } as MouseEvent);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawingService.clearCanvas', () => {
        service.isTransformationOver = true;
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

        service.onMouseMove({ movementX: 1, movementY: 1 } as MouseEvent);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onMouseMove should set selection.startingPoint', () => {
        service.isTransformationOver = true;
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');

        service.onMouseMove({ movementX: 1, movementY: 1 } as MouseEvent);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint).toEqual({ x: 1, y: 1 });
    });

    it('onKeyUp should clear interval if interval is not undefined and if none of the keys are pressed', () => {
        // tslint:disable-next-line: no-empty
        service.intervalId = setTimeout(() => {}, 100);

        service.onKeyUp({ key: 't'} as KeyboardEvent);

        expect(service.intervalId).toBe((undefined as unknown) as NodeJS.Timeout);
    });

    it('clearSelectionBackground should set selection background to white', () => {
        // create a black dummy canvas
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.height = 10;
        canvas.width = 10;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        service.clearSelectionBackground(ctx);

        expect(ctx.getImageData(0, 0, 1, 1).data).toEqual(new Uint8ClampedArray([255, 255, 255, 255]));
    });

    it('clearSelectionBackground should not change fillStyle', () => {
        // create a black dummy canvas
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.height = 10;
        canvas.width = 10;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';

        service.clearSelectionBackground(ctx);

        expect(ctx.fillStyle).toEqual('#000000');
    });

    it('printSelectionOnPreview should call drawingService.clearCanvas and clearSelectionBackground', () => {
        const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');

        service.printSelectionOnPreview();

        expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('printSelectionOnPreview should call drawingService.previewCtx.putImageData', () => {
        const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');

        service.printSelectionOnPreview();

        expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
        expect(previewCtxSpy.putImageData).toHaveBeenCalled();
    });

    it('printSelectionOnPreview should set isTransformationOver to false if isTransformationOver is true', () => {
        const clearSelectionBackgroundSpy = spyOn(service, 'clearSelectionBackground');
        service.isTransformationOver = true;

        service.printSelectionOnPreview();

        expect(clearSelectionBackgroundSpy).toHaveBeenCalled();
        expect(service.isTransformationOver).toBe(false);
    });

    it('move should call printSelectionOnPreview', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, false);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
    });

    it('move should not change startingPoint if no keys are pressed', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, false);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);
        const initialStartingPoint = service.selection.startingPoint;

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint).toEqual(initialStartingPoint);
    });

    it('move should change startingPoint.x if isArrowKeyLeftPressed', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, true);
        service.pressedKeys.set(ARROW_KEYS.UP, false);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);
        const initialXValue = service.selection.startingPoint.x;

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint.x).toEqual(initialXValue - 3);
    });

    it('move should change startingPoint.x if isArrowKeyRightPressed', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, false);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, true);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);
        const initialXValue = service.selection.startingPoint.x;

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint.x).toEqual(initialXValue + 3);
    });

    it('move should change startingPoint.y if isArrowKeyUpPressed', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, true);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);
        const initialYValue = service.selection.startingPoint.y;

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint.y).toEqual(initialYValue - 3);
    });

    it('move should change startingPoint.y if isArrowKeyDownPressed', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, false);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, true);
        const initialYValue = service.selection.startingPoint.y;

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint.y).toEqual(initialYValue + 3);
    });

    it('move should not change startingPoint if all keys are pressed', () => {
        const printSelectionOnPreviewSpy = spyOn(service, 'printSelectionOnPreview');
        service.pressedKeys.set(ARROW_KEYS.LEFT, true);
        service.pressedKeys.set(ARROW_KEYS.UP, true);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, true);
        service.pressedKeys.set(ARROW_KEYS.DOWN, true);
        const initialStartingPoint = service.selection.startingPoint;

        // tslint:disable-next-line: no-string-literal
        service['move'](service);

        expect(printSelectionOnPreviewSpy).toHaveBeenCalled();
        expect(service.selection.startingPoint).toEqual(initialStartingPoint);
    });

    it('isArrowKeyPressed should return true if at least one arrowKey is pressed', () => {
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, true);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);

        // tslint:disable-next-line: no-string-literal
        expect(service['isArrowKeyPressed']()).toBe(true);
    });

    it('isArrowKeyPressed should return true if all arrowKeys are pressed', () => {
        service.pressedKeys.set(ARROW_KEYS.LEFT, true);
        service.pressedKeys.set(ARROW_KEYS.UP, true);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, true);
        service.pressedKeys.set(ARROW_KEYS.DOWN, true);

        // tslint:disable-next-line: no-string-literal
        expect(service['isArrowKeyPressed']()).toBe(true);
    });

    it('isArrowKeyPressed should return false if no arrowKeys are pressed', () => {
        service.pressedKeys.set(ARROW_KEYS.LEFT, false);
        service.pressedKeys.set(ARROW_KEYS.UP, false);
        service.pressedKeys.set(ARROW_KEYS.RIGHT, false);
        service.pressedKeys.set(ARROW_KEYS.DOWN, false);

        // tslint:disable-next-line: no-string-literal
        expect(service['isArrowKeyPressed']()).toBe(false);
    });
});
