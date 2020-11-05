import { TestBed } from '@angular/core/testing';
import { FILL_STYLES } from '@app/ressources/global-variables/fill-styles';
import { DASH_LENGTH, DASH_SPACE_LENGTH, MouseButton } from '@app/ressources/global-variables/global-variables';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareService } from '@app/services/tools/square.service';
import { MoveService } from '@app/services/tools/transformation-services/move.service';
import { SelectionService } from './selection.service';
import SpyObj = jasmine.SpyObj;

describe('SelectionService', () => {
    let service: SelectionService;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let moveServiceSpy: SpyObj<MoveService>;
    let previewCtxSpy: SpyObj<CanvasRenderingContext2D>;
    let underlyingServiceSpy: SpyObj<SquareService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        moveServiceSpy = jasmine.createSpyObj('MoveService', ['printSelectionOnPreview', 'onMouseDown', 'onMouseMove', 'onKeyDown', 'onKeyUp']);
        underlyingServiceSpy = jasmine.createSpyObj('SquareService', ['onMouseDown', 'drawShape', 'onMouseMove', 'onKeyDown', 'onKeyUp']);
        previewCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['setLineDash']);
        drawingServiceSpy.previewCtx = previewCtxSpy;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: MoveService, useValue: moveServiceSpy },
            ],
        });
        service = TestBed.inject(SelectionService);

        service.underlyingService = underlyingServiceSpy;
        service.selection.height = 0;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initialize should set drawingService.previewCtx properties', () => {
        service.initialize();
        expect(previewCtxSpy.lineWidth).toEqual(1);
        expect(previewCtxSpy.strokeStyle).toEqual('black');
        expect(previewCtxSpy.setLineDash).toHaveBeenCalledWith([DASH_LENGTH, DASH_SPACE_LENGTH]);
    });

    it('onMouseDown should not call underliyingService.onMouseDown or moveService.onMouseDown if right click', () => {
        const mouseEvent = {
            button: MouseButton.RIGHT,
        } as MouseEvent;

        service.onMouseDown(mouseEvent);
        expect(underlyingServiceSpy.onMouseDown).not.toHaveBeenCalled();
        expect(moveServiceSpy.onMouseDown).not.toHaveBeenCalled();
    });

    it('onMouseDown should call underliyingService.onMouseDown if click is not in selection', () => {
        const mouseEvent = {
            button: MouseButton.LEFT,
        } as MouseEvent;
        const isInSelectionSpy = spyOn(service, 'isInSelection');
        isInSelectionSpy.and.returnValue(false);
        service.moveService.isTransformationOver = true;

        service.onMouseDown(mouseEvent);

        expect(isInSelectionSpy).toHaveBeenCalled();
        expect(service.selection).toEqual({ startingPoint: { x: 0, y: 0 }, width: 0, height: 0 });
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(underlyingServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    it('onMouseDown should call applypreview if click is not in selection and moveService is currently in transformation', () => {
        const mouseEvent = {
            button: MouseButton.LEFT,
        } as MouseEvent;
        const isInSelectionSpy = spyOn(service, 'isInSelection');
        const applyPreviewSpy = spyOn(service, 'applyPreview');
        isInSelectionSpy.and.returnValue(false);
        service.moveService.isTransformationOver = false;

        service.onMouseDown(mouseEvent);

        expect(isInSelectionSpy).toHaveBeenCalled();
        expect(moveServiceSpy.isTransformationOver).toEqual(true);
        expect(moveServiceSpy.printSelectionOnPreview).toHaveBeenCalled();
        expect(applyPreviewSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call moveService.onMouseDown if click is in selection', () => {
        const mouseEvent = {
            button: MouseButton.LEFT,
        } as MouseEvent;
        const isInSelectionSpy = spyOn(service, 'isInSelection');
        isInSelectionSpy.and.returnValue(true);

        service.onMouseDown(mouseEvent);
        expect(isInSelectionSpy).toHaveBeenCalled();
        expect(service.transormation).toEqual('move');
        expect(moveServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    it('onMouseUp should callgetPositionFromMouse and underlyingService.drawShape', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');
        getPositionFromMouseSpy.and.returnValue({ x: 0, y: 0 });
        underlyingServiceSpy.drawShape.and.returnValue({ startingPoint: { x: 0, y: 0 }, width: 0, height: 0 });
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = true;

        service.onMouseUp({} as MouseEvent);

        expect(getPositionFromMouseSpy).toHaveBeenCalledWith({} as MouseEvent);
        expect(underlyingServiceSpy.drawShape).toHaveBeenCalledWith(previewCtxSpy);
        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call drawingService.clearCanvas', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');
        getPositionFromMouseSpy.and.returnValue({ x: 0, y: 0 });
        underlyingServiceSpy.drawShape.and.returnValue({ startingPoint: { x: 0, y: 0 }, width: 0, height: 0 });
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = true;

        service.onMouseUp({} as MouseEvent);

        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledWith(previewCtxSpy);
        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not change underlyingService.fillStyle', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');
        getPositionFromMouseSpy.and.returnValue({ x: 0, y: 0 });
        underlyingServiceSpy.drawShape.and.returnValue({ startingPoint: { x: 0, y: 0 }, width: 0, height: 0 });
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = true;
        service.underlyingService.fillStyle = FILL_STYLES.BORDER;

        service.onMouseUp({} as MouseEvent);

        expect(service.underlyingService.fillStyle).toEqual(FILL_STYLES.BORDER);
        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set isNewSelection to false', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');
        getPositionFromMouseSpy.and.returnValue({ x: 0, y: 0 });
        underlyingServiceSpy.drawShape.and.returnValue({ startingPoint: { x: 0, y: 0 }, width: 0, height: 0 });
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = true;

        service.onMouseUp({} as MouseEvent);

        expect(service.isNewSelection).toEqual(false);
        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call setInitialSelection and setSelectionData if selection is not empty', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');
        getPositionFromMouseSpy.and.returnValue({ x: 0, y: 0 });
        underlyingServiceSpy.drawShape.and.returnValue({ startingPoint: { x: 0, y: 0 }, width: 10, height: 10 });
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = true;
        const setInitialSelectionSpy = spyOn(service, 'setInitialSelection');
        const setSelectionDataSpy = spyOn(service, 'setSelectionData');

        service.onMouseUp({} as MouseEvent);

        expect(setInitialSelectionSpy).toHaveBeenCalled();
        expect(setSelectionDataSpy).toHaveBeenCalled();
        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set transformation to empty string if transformation is move', () => {
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = false;
        service.transormation = 'move';

        service.onMouseUp({} as MouseEvent);

        expect(service.transormation).toEqual('');
        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseUp should call strokeSelection and setSelectionPoint', () => {
        const strokeSelectionSpy = spyOn(service, 'strokeSelection');
        const setSelectionPointSpy = spyOn(service, 'setSelectionPoint');
        service.isNewSelection = false;

        service.onMouseUp({} as MouseEvent);

        expect(strokeSelectionSpy).toHaveBeenCalled();
        expect(setSelectionPointSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call underlyingService.onMouseMove if isNewSelection', () => {
        service.isNewSelection = true;

        service.onMouseMove({} as MouseEvent);

        expect(underlyingServiceSpy.onMouseMove).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseMove should call moveService.onMouseMove if transformation is move', () => {
        service.isNewSelection = false;
        service.transormation = 'move';

        service.onMouseMove({} as MouseEvent);

        expect(moveServiceSpy.onMouseMove).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onKeyDown should call moveService.onKeyDown if selection is not empty', () => {
        service.selection = { startingPoint: { x: 0, y: 0 }, width: 10, height: 10 };

        service.onKeyDown({} as KeyboardEvent);

        expect(moveServiceSpy.onKeyDown).toHaveBeenCalledWith({} as KeyboardEvent);
    });

    it('onKeyDown should call underlyingService.onKeyDown if isNewSelection', () => {
        service.isNewSelection = true;

        service.onKeyDown({} as KeyboardEvent);

        expect(underlyingServiceSpy.onKeyDown).toHaveBeenCalledWith({} as KeyboardEvent);
    });

    it('onKeyDown should set isEscapeKeyPressed to true and call reset if EscapeKey pressed', () => {
        service.isNewSelection = true;
        const resetSpy = spyOn(service, 'reset');
        const event = {
            key: 'Escape',
        } as KeyboardEvent;

        service.onKeyDown(event);

        expect(service.isEscapeKeyPressed).toEqual(true);
        expect(resetSpy).toHaveBeenCalled();
    });
});
