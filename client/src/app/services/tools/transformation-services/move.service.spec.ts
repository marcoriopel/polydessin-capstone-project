import { TestBed } from '@angular/core/testing';
import { Rectangle } from '@app/classes/rectangle';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MoveService } from './move.service';
import SpyObj = jasmine.SpyObj;

describe('MoveService', () => {
    let service: MoveService;
    let drawingServiceSpy: SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(MoveService);

        const selection: Rectangle = { startingPoint: { x: 0, y: 0 }, width: 1, height: 1 };
        // tslint:disable-next-line: no-magic-numbers
        const selectionData: ImageData = { data: new Uint8ClampedArray([255, 255, 255, 255]), height: 1, width: 1 };
        service.initialize(selection, selectionData);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize service', () => {
        const selection: Rectangle = { startingPoint: { x: 3, y: 3 }, width: 2, height: 1 };
        // tslint:disable-next-line: no-magic-numbers
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
});
